import styles from "../styles/StatsBar.module.css";

/**
 * @param {{ total: number, shown: number, avgAge: string }} props
 */
export default function StatsBar({ total, shown, avgAge }) {
  const stats = [
    { label: "Total Students", value: total,  accent: "blue"  },
    { label: "Showing",        value: shown,  accent: "green" },
    { label: "Average Age",    value: avgAge, accent: "amber" },
  ];

  return (
    <div className={styles.bar}>
      {stats.map((s) => (
        <div key={s.label} className={`${styles.card} ${styles[s.accent]}`}>
          <span className={styles.value}>{s.value}</span>
          <span className={styles.label}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}
