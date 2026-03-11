import { useState, useEffect, useCallback } from "react";
import { validateStudent } from "../utils/validate";
import styles from "../styles/StudentForm.module.css";

const EMPTY = { name: "", email: "", age: "" };

/**
 * @param {{
 *   mode: 'add' | 'edit',
 *   initialData?: object,
 *   onSave: (data: object) => void,
 *   onClose: () => void
 * }} props
 */
export default function StudentForm({ mode, initialData, onSave, onClose }) {
  const [form,   setForm]   = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        name:  initialData.name,
        email: initialData.email,
        age:   String(initialData.age),
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [mode, initialData]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleSubmit = () => {
    const errs = validateStudent(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    // Simulate network latency
    setTimeout(() => {
      onSave({ name: form.name.trim(), email: form.email.trim(), age: Number(form.age) });
      setSaving(false);
    }, 650);
  };

  const isEdit = mode === "edit";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>{isEdit ? "✏️" : "➕"}</span>
            <div>
              <h2 className={styles.title}>{isEdit ? "Edit Student" : "Add New Student"}</h2>
              <p className={styles.subtitle}>
                {isEdit ? "Update the student's information below" : "Fill in the details to register a new student"}
              </p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Form Body */}
        <div className={styles.body}>
          <FormField
            label="Full Name"
            id="name"
            type="text"
            value={form.name}
            placeholder="e.g. Raj"
            error={errors.name}
            onChange={(v) => handleChange("name", v)}
          />
          <FormField
            label="Email Address"
            id="email"
            type="email"
            value={form.email}
            placeholder="e.g. guptaraj@university.edu"
            error={errors.email}
            onChange={(v) => handleChange("email", v)}
          />
          <FormField
            label="Age"
            id="age"
            type="number"
            value={form.age}
            placeholder="e.g. 21"
            error={errors.age}
            onChange={(v) => handleChange("age", v)}
          />
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className={styles.saveBtn} onClick={handleSubmit} disabled={saving}>
            {saving ? (
              <><span className={styles.spinner} /> Saving…</>
            ) : (
              isEdit ? "Save Changes" : "Add Student"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Internal field component ── */
function FormField({ label, id, type, value, placeholder, error, onChange }) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        min={type === "number" ? 1 : undefined}
        max={type === "number" ? 120 : undefined}
      />
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}
