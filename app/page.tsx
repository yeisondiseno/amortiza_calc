import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Amortiza Calc</h1>
        <p className={styles.description}>
          Calculadora de amortización de préstamos.
        </p>
        <div className={styles.card}>
          <h2>Empezando</h2>
          <p>Edita <code>app/page.tsx</code> para comenzar.</p>
        </div>
      </main>
    </div>
  );
}
