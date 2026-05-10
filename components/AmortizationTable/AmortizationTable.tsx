"use client";

// React
import { useMemo, useState } from "react";
// Libraries
import { useLocale, useTranslations } from "next-intl";
import { HiOutlineDownload } from "react-icons/hi";
// Utils
import { formatFromUsd, rowDate } from "@/utils";
// Types
import type { LoanResult } from "@/types";
import type { CurrencyCode } from "@/constants";
// Styles
import shared from "@/shared";
import styles from "./AmortizationTable.module.css";
// Constants
const PREVIEW_ROWS = 12; // first year
const EXPANDED_ROWS = 60; // first five years

type Props = { result: LoanResult | null; currency: CurrencyCode };

export const AmortizationTable = ({ result, currency }: Props) => {
  // State
  const [expanded, setExpanded] = useState(false);

  // Hooks
  const t = useTranslations("calculator.table");
  const locale = useLocale();

  // Values
  const allRows = result?.rows ?? [];
  const limit = expanded ? EXPANDED_ROWS : PREVIEW_ROWS;
  const rows = useMemo(() => allRows.slice(0, limit), [allRows, limit]);
  const remainingYears = Math.max(
    0,
    Math.ceil((allRows.length - rows.length) / 12),
  );

  return (
    <section className={styles.section}>
      {/* Section header */}
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={`${shared.sectionTitle} ${styles.title}`}>
            {t("title")}
          </h2>
          <p className={`${shared.label} ${styles.subtitle}`}>
            {t(expanded ? "subtitleExpanded" : "subtitle")}
          </p>
        </div>
        <button type="button" className={shared.btnGhost}>
          <HiOutlineDownload className={shared.iconSvgSm} aria-hidden />
          {t("exportCSV")}
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thLeft}>{t("month")}</th>
                <th>{t("principal")}</th>
                <th>{t("interest")}</th>
                <th>{t("extra")}</th>
                <th className={styles.thRight}>{t("remainingBalance")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={styles.row}>
                  <td className={styles.tdLeft}>{rowDate(row.month)}</td>
                  <td>{formatFromUsd(row.principal, currency, locale)}</td>
                  <td>{formatFromUsd(row.interest, currency, locale)}</td>
                  <td className={styles.extraCell}>
                    {formatFromUsd(row.extra, currency, locale)}
                  </td>
                  <td className={styles.tdRight}>
                    {formatFromUsd(row.balance, currency, locale)}
                  </td>
                </tr>
              ))}
              {allRows.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.emptyCell}>
                    {t("empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Expand / collapse */}
        <div className={styles.tableFooter}>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className={styles.expandBtn}
          >
            {expanded
              ? t("collapse")
              : t("viewFull", { years: remainingYears })}
          </button>
        </div>
      </div>
    </section>
  );
};
