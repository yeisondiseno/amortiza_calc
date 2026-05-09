"use client";

// Libraries
import { useTranslations } from "next-intl";

// Utils
import { formatUSD } from "./utils";

// Types
import type { LoanResult, ChartView } from "./types";

// Styles
import shared from "./shared.module.css";
import styles from "./BalanceChart.module.css";

// Constants
const W = 400;
const H = 100;
const VIEWS: ChartView[] = ["Monthly", "Annually"];

const pathFor = (series: number[], maxBal: number): string => {
  if (!series?.length) return "";
  const step = W / (series.length - 1);
  return series
    .map((b, i) => {
      const x = (i * step).toFixed(2);
      const y = ((1 - b / maxBal) * H + 2).toFixed(2);
      return (i === 0 ? "M" : "L") + x + "," + y;
    })
    .join(" ");
};

type Props = {
  result: LoanResult | null;
  view: ChartView;
  setView: (v: ChartView) => void;
};

export const BalanceChart = ({ result, view, setView }: Props) => {
  // Hooks
  const t = useTranslations("calculator.chart");

  // Values
  const stdSeries = result?.stdSeries ?? [1, 1];
  const accSeries = result?.accSeries ?? [1, 1];
  const maxBal = Math.max(...stdSeries, 1);
  const totalYears = Math.round((result?.n ?? 360) / 12);

  const stdPath = pathFor(stdSeries, maxBal);
  const accPath = pathFor(accSeries, maxBal);
  const stdFill = stdPath + ` L${W},${H} L0,${H} Z`;
  const accEndX = (
    (result?.monthsToPayoff ?? 0) *
    (W / Math.max(stdSeries.length - 1, 1))
  ).toFixed(2);
  const accFill = accPath + ` L${accEndX},${H} L0,${H} Z`;

  return (
    <div className={shared.card}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={shared.sectionTitle}>{t("title")}</h3>
        <div className={styles.controls}>
          {/* Legend */}
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div className={`${styles.dot} ${styles.dotStandard}`} />
              <span className={styles.legendLabel}>{t("standard")}</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.dot} ${styles.dotAccelerated}`} />
              <span className={styles.legendLabel}>{t("withExtra")}</span>
            </div>
          </div>
          {/* View toggle */}
          <div className={styles.segmented}>
            {VIEWS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`${styles.segBtn} ${view === v ? styles.segBtnActive : ""}`}
              >
                {t(v === "Monthly" ? "monthly" : "annually")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className={styles.chartWrap}>
        <svg
          className={styles.svg}
          preserveAspectRatio="none"
          viewBox={`0 0 ${W} ${H}`}
        >
          <path d={stdFill} fill="#e0e3e5" opacity="0.4" />
          <path
            d={stdPath}
            fill="none"
            stroke="#76777d"
            strokeDasharray="4"
            strokeWidth="1.5"
          />
          <path d={accFill} fill="#6cf8bb" opacity="0.25" />
          <path d={accPath} fill="none" stroke="#006c49" strokeWidth="2" />
        </svg>
        <div className={styles.xAxis}>
          <span>{t("yearLabel", { year: 0 })}</span>
          <span>{t("yearLabel", { year: Math.round(totalYears / 3) })}</span>
          <span>{t("yearLabel", { year: Math.round((totalYears * 2) / 3) })}</span>
          <span>{t("yearLabel", { year: totalYears })}</span>
        </div>
      </div>

      {/* Footer: monthly payment */}
      <div className={styles.chartFooter}>
        <span className={shared.label}>{t("monthlyPayment")}</span>
        <span className={`${shared.numberDisplaySm} ${styles.paymentValue}`}>
          {formatUSD(result?.basePayment ?? 0, 2)}
        </span>
      </div>
    </div>
  );
};
