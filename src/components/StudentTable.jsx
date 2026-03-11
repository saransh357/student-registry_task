import styles from "../styles/StudentTable.module.css";

/**
 * @param {{
 *   students: Array,
 *   loading: boolean,
 *   search: string,
 *   onEdit: (student: object) => void,
 *   onDelete: (student: object) => void
 * }} props
 */
export default function StudentTable({ students, loading, search, onEdit, onDelete }) {
  // Generate a consistent hue from a name string
  const hue = (name) => (name.charCodeAt(0) * 23 + name.charCodeAt(1) * 7) % 360;

  const initials = (name) =>
    name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const columns = ["#", "Student", "Email", "Age", "Actions"];

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={col} className={`${styles.th} ${i === 4 ? styles.right : ""}`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* ── Loading skeleton ── */}
          {loading &&
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={`skel-${i}`} className={styles.skeletonRow}>
                {[32, 160, 190, 40, 100].map((w, j) => (
                  <td key={j} className={styles.td}>
                    <div
                      className={styles.skeleton}
                      style={{ width: w, animationDelay: `${i * 0.08}s` }}
                    />
                  </td>
                ))}
              </tr>
            ))}

          {/* ── Empty state ── */}
          {!loading && students.length === 0 && (
            <tr>
              <td colSpan={5} className={styles.empty}>
                <div className={styles.emptyIcon}>🎓</div>
                <p className={styles.emptyText}>
                  {search
                    ? "No students match your search"
                    : "No students yet — add one to get started"}
                </p>
              </td>
            </tr>
          )}

          {/* ── Data rows ── */}
          {!loading &&
            students.map((student, i) => (
              <tr
                key={student.id}
                className={styles.row}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <td className={`${styles.td} ${styles.index}`}>
                  {String(i + 1).padStart(2, "0")}
                </td>

                <td className={styles.td}>
                  <div className={styles.student}>
                    <div
                      className={styles.avatar}
                      style={{
                        background: `hsl(${hue(student.name)}, 60%, 92%)`,
                        color: `hsl(${hue(student.name)}, 60%, 35%)`,
                        border: `1.5px solid hsl(${hue(student.name)}, 60%, 80%)`,
                      }}
                    >
                      {initials(student.name)}
                    </div>
                    <span className={styles.name}>{student.name}</span>
                  </div>
                </td>

                <td className={`${styles.td} ${styles.email}`}>{student.email}</td>

                <td className={styles.td}>
                  <span className={styles.ageBadge}>{student.age}</span>
                </td>

                <td className={`${styles.td} ${styles.actions}`}>
                  <button
                    className={styles.editBtn}
                    onClick={() => onEdit(student)}
                    title="Edit student"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => onDelete(student)}
                    title="Delete student"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Footer */}
      {!loading && students.length > 0 && (
        <div className={styles.footer}>
          <span>{students.length} student{students.length !== 1 ? "s" : ""} shown</span>
          <span>In-memory · No persistence</span>
        </div>
      )}
    </div>
  );
}
