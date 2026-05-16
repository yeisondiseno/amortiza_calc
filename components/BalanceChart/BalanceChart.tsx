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

const VIEWS: ChartView[] = ["Monthly", "Annually"];

type Props = {
  result: LoanResult | null;
  currency: CurrencyCode;
  view: ChartView;
  setView: (v: ChartView) => void;
};

export const BalanceChart = ({ result, currency, view, setView }: Props) => {
  const t = useTranslations("calculator.chart");
  const locale = useLocale();

  const stdSeries = result?.stdSeries ?? [1, 1];
  const accSeries = result?.accSeries ?? [1, 1];
  const totalYears = Math.round((result?.n ?? 360) / 12);

  const series = useMemo(
    () => [
      { name: t("standard"), data: stdSeries },
      { name: t("withExtra"), data: accSeries },
    ],
    [stdSeries, accSeries, t],
  );

  const options = useMemo(
    () => ({
      chart: {
        type: "area" as const,
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: { enabled: false },
        background: "transparent",
      },
      stroke: {
        curve: "smooth" as const,
        width: [1.5, 2],
        dashArray: [4, 0],
      },
      fill: {
        colors: ["#006c49", "#6cf8bb"],
        type: "solid",
        opacity: [0.4, 0.25],
      },
      // colors: ["#76777d", "#006c49"],
      dataLabels: { enabled: false },
      legend: { show: false },
      grid: {
        borderColor: "rgba(0,0,0,0.06)",
        strokeDashArray: 3,
        padding: { left: 0, right: 0, top: 0, bottom: 0 },
      },
      xaxis: {
        min: 0,
        tickAmount: 3,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            fontSize: "0.625rem",
            fontWeight: "600",
            colors: "#9aa0a6",
          },
          formatter: (val: string) => {
            const idx = Math.round(Number(val));
            const year = view === "Monthly" ? Math.round(idx / 12) : idx;
            return t("yearLabel", { year });
          },
        },
      },
      yaxis: { show: false },
      tooltip: {
        theme: "light",
        x: {
          formatter: (val: number) => {
            const year = view === "Monthly" ? Math.round(val / 12) : val;
            return t("yearLabel", { year });
          },
        },
        y: {
          formatter: (val: number) => formatFromUsd(val, currency, locale),
        },
      },
    }),
    [view, t, currency, locale, totalYears],
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
