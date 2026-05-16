"use client";

// Libraries
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
// Utils
import { formatFromUsd } from "@/utils";
// Types
import type { ChartView, LoanResult } from "@/types";
import type { CurrencyCode } from "@/constants";
// Styles
import shared from "@/shared";
import styles from "./BalanceChart.module.css";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

/** Tokens alineados con `app/globals.css` (Apex no resuelve `var()` en opciones). */
const CHART = {
  onSurfaceVariant: "#45464d",
  outline: "#76777d",
  secondary: "#006c49",
  surfaceHigh: "#e6e8ea",
} as const;

const VIEWS: ChartView[] = ["Monthly", "Annually"];

/** Saldo al terminar `monthIndex` usando una serie mensual (permite amortización corta antes de `totalMonths`). */
function balanceAtMonth(series: number[], monthIndex: number): number {
  if (series.length === 0) return 0;
  const capped = Math.min(Math.max(0, monthIndex), series.length - 1);
  return series[capped] ?? 0;
}

/** Meses muestra anual (0,12,24,… hasta el último mes `totalMonths`). */
function annualMonthsForChart(totalMonths: number): number[] {
  const ms: number[] = [];
  for (let m = 0; m < totalMonths; m += 12) ms.push(m);
  if (ms.length === 0 || ms[ms.length - 1] !== totalMonths) {
    ms.push(totalMonths);
  }
  return ms;
}

/** Balance en cada corte anual usando la serie mensual. */
function toAnnualBalances(series: number[], totalMonths: number): number[] {
  if (series.length <= 1) return series.length === 1 ? [...series] : [1];
  return annualMonthsForChart(totalMonths).map((m) =>
    balanceAtMonth(series, m),
  );
}

type Props = {
  result: LoanResult | null;
  currency: CurrencyCode;
  view: ChartView;
  setView: (v: ChartView) => void;
};

export const BalanceChart = ({ result, currency, view, setView }: Props) => {
  const t = useTranslations("calculator.chart");
  const locale = useLocale();

  const series = useMemo(() => {
    const std = result?.stdSeries ?? [1, 1];
    const acc = result?.accSeries ?? [1, 1];
    const totalMonths =
      result?.n ?? Math.max(std.length, acc.length) - 1;
    const isMonthly = view === "Monthly";
    return [
      {
        name: t("standard"),
        data: isMonthly ? std : toAnnualBalances(std, totalMonths),
      },
      {
        name: t("withExtra"),
        data: isMonthly ? acc : toAnnualBalances(acc, totalMonths),
      },
    ];
  }, [result, view, t]);

  const options = useMemo(
    () => ({
      chart: {
        type: "area" as const,
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: { enabled: false },
        background: "transparent",
        fontFamily: 'Inter, system-ui, sans-serif',
        foreColor: CHART.onSurfaceVariant,
      },
      stroke: {
        curve: "smooth" as const,
        width: [2, 2.5],
        dashArray: [5, 0],
      },
      fill: {
        type: "gradient" as const,
        gradient: {
          shade: "light" as const,
          type: "vertical" as const,
          shadeIntensity: 0.2,
          opacityFrom: 0.38,
          opacityTo: 0.02,
          stops: [0, 88, 100],
        },
      },
      colors: [CHART.outline, CHART.secondary],
      dataLabels: { enabled: false },
      legend: { show: false },
      grid: {
        borderColor: CHART.surfaceHigh,
        strokeDashArray: 4,
        padding: { left: 4, right: 8, top: 8, bottom: 0 },
      },
      xaxis: {
        min: 0,
        tickAmount: 3,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            fontSize: "11px",
            fontWeight: "600",
            fontFamily: 'Inter, system-ui, sans-serif',
            colors: CHART.onSurfaceVariant,
          },
          formatter: (val: string) => {
            const x = Math.round(Number(val));
            const year =
              view === "Monthly"
                ? Math.round(x / 12)
                : x;
            return t("yearLabel", { year });
          },
        },
      },
      yaxis: { show: false },
      tooltip: {
        theme: "light" as const,
        cssClass: "balance-chart-tooltip",
        x: {
          formatter: (val: number) =>
            t("yearLabel", {
              year:
                view === "Monthly"
                  ? Math.round(val / 12)
                  : Math.round(val),
            }),
        },
        y: {
          formatter: (val: number) => formatFromUsd(val, currency, locale),
        },
      },
    }),
    [view, t, currency, locale],
  );

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
        <ReactApexChart
          key={view}
          type="area"
          series={series}
          options={options}
          height="300px"
          width="100%"
        />
      </div>

      {/* Footer: monthly payment */}
      <div className={styles.chartFooter}>
        <span className={shared.label}>{t("monthlyPayment")}</span>
        <span className={`${shared.numberDisplaySm} ${styles.paymentValue}`}>
          {formatFromUsd(result?.basePayment ?? 0, currency, locale)}
        </span>
      </div>
    </div>
  );
};
