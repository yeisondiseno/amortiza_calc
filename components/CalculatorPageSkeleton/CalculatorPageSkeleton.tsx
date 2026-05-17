// React
import type { ReactElement } from "react";

import calcStyles from "../AmortizationCalculator/AmortizationCalculator.module.css";

import styles from "./CalculatorPageSkeleton.module.css";

const B = ({ cls }: Readonly<{ cls?: string }>) => (
  <span
    className={cls === undefined ? styles.block : `${styles.block} ${cls}`}
    aria-hidden="true"
  />
);

/** Contenido esqueleta: mismo grid líquido 5fr/7fr + tabs + chart + intro. */
const SkeletonInner = (): ReactElement => (
  <>
    <div className={calcStyles.grid}>
      <div className={styles.formCard}>
        <B cls={styles.formTitle} />
        <div className={styles.amountCurrencyRow}>
          <div className={styles.fieldRow}>
            <B cls={styles.fieldLabel} />
            <B cls={styles.fieldLine} />
          </div>
          <div className={styles.fieldRow}>
            <B cls={styles.fieldLabel} />
            <B cls={styles.fieldLine} />
          </div>
        </div>
        <div className={styles.metricRow}>
          <div className={styles.fieldRow}>
            <B cls={styles.fieldLabel} />
            <B cls={styles.fieldLine} />
          </div>
          <div className={styles.fieldRow}>
            <B cls={styles.fieldLabel} />
            <B cls={styles.fieldLine} />
          </div>
        </div>
        <div className={styles.freqRow}>
          <B cls={styles.fieldLabel} />
          <B cls={styles.freqBar} />
        </div>
        <B cls={styles.btnBar} />
        <div className={styles.fieldRow}>
          <B cls={styles.fieldLabel} />
          <B cls={styles.fieldLine} />
        </div>
      </div>

      <div className={calcStyles.results} aria-hidden="true">
        <div className={styles.metricStack}>
          <div className={styles.metricHero}>
            <B cls={styles.metricHeroLabel} />
            <B cls={styles.metricHeroNum} />
            <B cls={styles.fieldLine} />
          </div>
          <div className={styles.metricRow}>
            <div className={styles.metricCell}>
              <B cls={styles.metricLbl} />
              <B cls={styles.metricVal} />
            </div>
            <div className={styles.metricCell}>
              <B cls={styles.metricLbl} />
              <B cls={styles.metricVal} />
            </div>
          </div>
          <div className={styles.metricRow}>
            <div className={styles.metricCell}>
              <B cls={styles.metricLbl} />
              <B cls={styles.metricVal} />
            </div>
            <div className={styles.metricCell}>
              <B cls={styles.metricLbl} />
              <B cls={styles.metricVal} />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.tabBarSkeleton}>
      <B cls={styles.tabPill} />
      <B cls={styles.tabPill} />
    </div>

    <div className={styles.chartPanel}>
      <div className={styles.chartToolbar}>
        <B cls={styles.chartChip} />
        <B cls={styles.chartChip} />
        <B cls={styles.chartChip} />
      </div>
      <B cls={styles.chartBody} />
    </div>

    <section className={`${calcStyles.pageIntro} ${styles.introWrap}`}>
      <div className={styles.introCard}>
        <B cls={styles.introTitle} />
        <span aria-hidden="true" className={`${styles.block} ${styles.introLine}`} />
        <span
          aria-hidden="true"
          className={`${styles.block} ${styles.introLine} ${styles.introLineShort}`}
        />
        <span
          aria-hidden="true"
          className={`${styles.block} ${styles.introLine} ${styles.introLineXs}`}
        />
        <span aria-hidden="true" className={`${styles.block} ${styles.introLine}`} />
        <span
          aria-hidden="true"
          className={`${styles.block} ${styles.introLine} ${styles.introLineShort}`}
        />
      </div>
    </section>
  </>
);

type Props = Readonly<{
  /** `route`: TopBar + main + dock móvil (Next `loading.tsx`). `embedded`: solo cuerpo (pre-hidratación del cliente). */
  variant: "route" | "embedded";
  /** Opcional cuando `embedded` coincide con etiquetas vivas cercanas */
  srLabel?: string;
}>;

/** Esqueleta responsiva que imita LoanForm, ResultCards, pestañas, gráfico e intro editorial. */
export const CalculatorPageSkeleton = ({
  variant,
  srLabel = "Loading calculator",
}: Props) => {
  const busyMain = variant === "route";

  const inner = <SkeletonInner />;

  if (variant === "embedded") {
    return (
      <>
        <span className="sr-only">{srLabel}</span>
        {inner}
      </>
    );
  }

  return (
    <>
      <header className={styles.topBar} aria-hidden="true">
        <div className={styles.topBarInner}>
          <B cls={styles.wordmark} />
          <B cls={styles.langControl} />
        </div>
      </header>
      <main
        className={calcStyles.main}
        aria-busy={busyMain ? "true" : undefined}
        aria-label={srLabel}
      >
        <span className="sr-only">{srLabel}</span>
        {inner}
      </main>
      <nav className={styles.bottomDock} aria-hidden="true">
        <B cls={styles.bottomItem} />
        <B cls={styles.bottomItem} />
      </nav>
    </>
  );
};
