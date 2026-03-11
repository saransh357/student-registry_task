import { useState, useEffect, useRef, useCallback } from "react";

import initialStudents       from "./data/students";
import { exportToExcel }     from "./utils/exportExcel";
import { publishToBackend }  from "./utils/publishToBackend";

import StudentTable  from "./components/StudentTable";
import StudentForm   from "./components/StudentForm";
import DeleteDialog  from "./components/DeleteDialog";
import StatsBar      from "./components/StatsBar";
import Toast         from "./components/Toast";

import styles from "./styles/App.module.css";

export default function App() {
  /* ── State ── */
  const [students,     setStudents]     = useState(initialStudents);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [formModal,    setFormModal]    = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast,        setToast]        = useState(null);
  const [publishing,   setPublishing]   = useState(false);  // publish loading state
  const [published,    setPublished]    = useState(false);  // success checkmark state
  const nextId = useRef(initialStudents.length + 1);

  /* ── Simulate initial load ── */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  /* ── Toast helper ── */
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  /* ── Filtered list ── */
  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q)  ||
      s.email.toLowerCase().includes(q) ||
      String(s.age).includes(q)
    );
  });

  /* ── CRUD handlers ── */
  const handleAdd = useCallback(() => {
    setFormModal({ mode: "add" });
  }, []);

  const handleEdit = useCallback((student) => {
    setFormModal({ mode: "edit", student });
  }, []);

  const handleSave = useCallback((data) => {
    if (formModal.mode === "add") {
      setStudents((prev) => [
        ...prev,
        { id: nextId.current++, ...data },
      ]);
      showToast(`${data.name} added successfully`);
    } else {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === formModal.student.id ? { ...s, ...data } : s
        )
      );
      showToast(`${data.name} updated successfully`);
    }
    setFormModal(null);
  }, [formModal, showToast]);

  const handleDeleteRequest = useCallback((student) => {
    setDeleteTarget(student);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    const name = deleteTarget.name;
    setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    showToast(`${name} has been removed`, "error");
    setDeleteTarget(null);
  }, [deleteTarget, showToast]);

  /* ── Export ── */
  const handleExport = useCallback(() => {
    const data = search ? filtered : students;
    exportToExcel(data);
    showToast(`Exported ${data.length} record${data.length !== 1 ? "s" : ""} to Excel`, "info");
  }, [search, filtered, students, showToast]);

  /* ── Publish to Backend ── */
  const handlePublish = useCallback(async () => {
    if (publishing) return;
    setPublishing(true);
    setPublished(false);
    try {
      const result = await publishToBackend(students);
      setPublished(true);
      showToast(`✓ ${result.count} records published to backend`, "success");
      // Reset the checkmark after 3 seconds
      setTimeout(() => setPublished(false), 3000);
    } catch (err) {
      showToast("Failed to publish — check your backend URL", "error");
    } finally {
      setPublishing(false);
    }
  }, [publishing, students, showToast]);

  /* ── Stats ── */
  const avgAge = students.length
    ? (students.reduce((sum, s) => sum + s.age, 0) / students.length).toFixed(1)
    : "—";

  return (
    <div className={styles.page}>
      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      {/* ── Modals ── */}
      {formModal && (
        <StudentForm
          mode={formModal.mode}
          initialData={formModal.student}
          onSave={handleSave}
          onClose={() => setFormModal(null)}
        />
      )}

      {deleteTarget && (
        <DeleteDialog
          student={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* ── Layout ── */}
      <div className={styles.container}>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerText}>
            <div className={styles.badge}>Registry v1.0</div>
            <h1 className={styles.title}>Student Registry</h1>
            <p className={styles.subtitle}>
              Manage student records with full CRUD operations — all data stored in memory.
            </p>
          </div>
        </header>

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or age…"
            />
            {search && (
              <button className={styles.clearBtn} onClick={() => setSearch("")}>✕</button>
            )}
          </div>

          <div className={styles.btnGroup}>
            <button className={styles.exportBtn} onClick={handleExport}>
              ⬇ Export Excel
              {search && filtered.length !== students.length && (
                <span className={styles.exportBadge}>{filtered.length}</span>
              )}
            </button>
            <button
              className={`${styles.publishBtn} ${published ? styles.publishedBtn : ""}`}
              onClick={handlePublish}
              disabled={publishing || students.length === 0}
              title="Sync all student records to your backend API"
            >
              {publishing ? (
                <><span className={styles.publishSpinner} /> Publishing…</>
              ) : published ? (
                <>✓ Published!</>
              ) : (
                <>⬆ Publish to Backend</>
              )}
            </button>
            <button className={styles.addBtn} onClick={handleAdd}>
              + Add Student
            </button>
          </div>
        </div>

        {/* Stats */}
        <StatsBar
          total={students.length}
          shown={filtered.length}
          avgAge={avgAge}
        />

        {/* Table */}
        <StudentTable
          students={filtered}
          loading={loading}
          search={search}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      </div>
    </div>
  );
}
