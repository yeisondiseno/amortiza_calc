"use client";

// React
import { useMemo, useState } from "react";

// Libraries
import { useTranslations } from "next-intl";

// Types
import type { AmortizationRow } from "./AmortizationCalculator";

// Styles
import styles from "./AmortizationTable.module.css";

// Constants
const PAGE_SIZE = 24;

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

type Props = { schedule: AmortizationRow[] };

export const AmortizationTable = ({ schedule }: Props) => {
  // State
  const [page, setPage] = useState(0);

  // Hooks
  const t = useTranslations("calculator.table");

  // Values
  const totalPages = Math.ceil(schedule.length / PAGE_SIZE);
  const pageData = useMemo(
    () => schedule.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [schedule, page]
  );

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t("month")}</th>
              <th>{t("payment")}</th>
              <th>{t("principal")}</th>
              <th>{t("interest")}</th>
              <th>{t("balance")}</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((row) => (
              <tr key={row.month}>
                <td>{row.month}</td>
                <td>${fmt(row.payment)}</td>
                <td>${fmt(row.principal)}</td>
                <td>${fmt(row.interest)}</td>
                <td>${fmt(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            type="button"
          >
            ←
          </button>
          <span className={styles.pageInfo}>
            {page + 1} / {totalPages}
          </span>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            type="button"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};
