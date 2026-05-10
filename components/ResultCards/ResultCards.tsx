"use client";

// Libraries
import { useTranslations } from "next-intl";

// Utils
import { payoffDate } from "@/utils";

// Types
import type { LoanResult } from "@/types";

// Styles
import shared from "@/shared";
import styles from "./ResultCards.module.css";

type Props = { result: LoanResult | null };

export const ResultCards = ({ result }: Props) => {
  // Hooks
  const t = useTranslations("calculator.results");

  // Values
  const interestSaved = result?.interestSaved ?? 0;
  const pct = result?.interestSavedPct ?? 0;
  const yearsSaved = result?.yearsSaved ?? 0;
  const yearsWhole = Math.floor(yearsSaved);
  const yearsLabel = yearsWhole >= 1 ? t("years") : t("months");
  const yearsValue = yearsWhole >= 1 ? yearsWhole : Math.round(yearsSaved * 12);
  const payoff = result ? payoffDate(result.monthsToPayoff) : "—";

  return (
    <div className={styles.grid}>
      {/* Interest Saved */}
      <div className={shared.card}>
        <span className={`${shared.label} ${styles.cardLabel}`}>
          {t("interestSaved")}
        </span>
        <div className={styles.heroNumber}>
          <span className={styles.currencySign}>$</span>
          <span className={`${shared.numberDisplay} ${styles.savedValue}`}>
            {Math.round(interestSaved).toLocaleString("en-US")}
          </span>
        </div>
        <div className={styles.footer}>
          <span className={`${shared.iconSm} ${styles.iconGreen}`}>
            trending_up
          </span>
          <span className={styles.footerText}>
            {pct.toFixed(1)}
            {t("lessPct")}
          </span>
        </div>
      </div>

      {/* Time Saved */}
      <div className={shared.card}>
        <span className={`${shared.label} ${styles.cardLabel}`}>
          {t("timeSaved")}
        </span>
        <div className={styles.heroNumber}>
          <span className={`${shared.numberDisplay} ${styles.timeValue}`}>
            {yearsValue}
          </span>
          <span className={`${shared.numberDisplaySm} ${styles.timeUnit}`}>
            {yearsLabel}
          </span>
        </div>
        <div className={styles.footer}>
          <span className={`${shared.iconSm} ${styles.iconBlue}`}>
            schedule
          </span>
          <span className={`${styles.footerText} ${styles.footerBlue}`}>
            {t("paidOffBy")} {payoff}
          </span>
        </div>
      </div>
    </div>
  );
};
