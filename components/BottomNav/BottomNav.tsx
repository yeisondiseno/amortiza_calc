"use client";

// React
import { useState } from "react";

// Libraries
import { useTranslations } from "next-intl";

// Styles
import shared from "../shared.module.css";
import styles from "./BottomNav.module.css";

// Constants
const NAV_ITEMS = [
  { id: "calculator", icon: "calculate" },
  { id: "schedule", icon: "calendar_month" },
  { id: "saved", icon: "bookmark" },
] as const;

type NavId = (typeof NAV_ITEMS)[number]["id"];

export const BottomNav = () => {
  // State
  const [active, setActive] = useState<NavId>("calculator");

  // Hooks
  const t = useTranslations("calculator.bottomNav");

  return (
    <footer className={styles.footer}>
      {NAV_ITEMS.map(({ id, icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => setActive(id)}
          className={`${styles.navItem} ${active === id ? styles.navItemActive : ""}`}
        >
          <span className={shared.icon}>{icon}</span>
          <span className={styles.label}>{t(id)}</span>
        </button>
      ))}
    </footer>
  );
};
