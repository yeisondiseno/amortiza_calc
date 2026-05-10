"use client";

// React
import { useState } from "react";

// Libraries
import { useTranslations } from "next-intl";

// Styles
import shared from "../shared.module.css";
import styles from "./TopBar.module.css";

// Constants
const NAV_TABS = ["calculator", "amortization", "history"] as const;
type NavTab = (typeof NAV_TABS)[number];

export const TopBar = () => {
  // State
  const [active, setActive] = useState<NavTab>("calculator");

  // Hooks
  const t = useTranslations("calculator.topbar");

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Wordmark */}
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <span className={shared.icon}>request_quote</span>
          </div>
          <span className={styles.brandName}>LoanCalc</span>
        </div>

        {/* Nav tabs */}
        <nav className={styles.nav}>
          {NAV_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              className={`${styles.navBtn} ${active === tab ? styles.navBtnActive : ""}`}
            >
              {t(tab)}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <button type="button" className={styles.iconBtn} aria-label="Settings">
            <span className={shared.icon}>settings</span>
          </button>
          <div className={styles.avatar}>JM</div>
        </div>
      </div>
    </header>
  );
};
