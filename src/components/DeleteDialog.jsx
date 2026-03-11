import { useEffect } from "react";
import styles from "../styles/DeleteDialog.module.css";

/**
 * @param {{
 *   student: { name: string, email: string },
 *   onConfirm: () => void,
 *   onCancel: () => void
 * }} props
 */
export default function DeleteDialog({ student, onConfirm, onCancel }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>

        {/* Icon */}
        <div className={styles.iconWrap}>
          <span className={styles.icon}>🗑️</span>
        </div>

        {/* Content */}
        <h2 className={styles.title}>Remove Student?</h2>
        <p className={styles.body}>
          You are about to permanently remove{" "}
          <strong className={styles.highlight}>{student.name}</strong>{" "}
          <span className={styles.email}>({student.email})</span> from the registry.
          <br />
          This action <em>cannot be undone</em>.
        </p>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Keep Student
          </button>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            Yes, Remove
          </button>
        </div>
      </div>
    </div>
  );
}
