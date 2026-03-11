import { useEffect, useState } from "react";
import styles from "../styles/Toast.module.css";

/**
 * @param {{ message: string, type: 'success' | 'error' | 'info', onDismiss: () => void }} props
 */
export default function Toast({ message, type = "success", onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const show = requestAnimationFrame(() => setVisible(true));

    // Auto-dismiss after 3s
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 3000);

    return () => {
      cancelAnimationFrame(show);
      clearTimeout(timer);
    };
  }, [onDismiss]);

  const icons = { success: "✓", error: "✕", info: "i" };

  return (
    <div className={`${styles.toast} ${styles[type]} ${visible ? styles.visible : ""}`}>
      <span className={styles.icon}>{icons[type]}</span>
      <span className={styles.message}>{message}</span>
    </div>
  );
}
