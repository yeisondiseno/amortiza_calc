"use client";

// React
import { useState } from "react";

// Libraries
import { useTranslations } from "next-intl";
import {
  HiOutlineBookmark,
  HiOutlineCalculator,
  HiOutlineCalendar,
} from "react-icons/hi";

// Styles
import shared from "@/shared";
import styles from "./BottomNav.module.css";

// Constants
const NAV_ITEMS = [
  { id: "calculator" as const, Icon: HiOutlineCalculator },
  { id: "schedule" as const, Icon: HiOutlineCalendar },
  { id: "saved" as const, Icon: HiOutlineBookmark },
] as const;

type NavId = (typeof NAV_ITEMS)[number]["id"];

export const BottomNav = () => {
  // State
  const [active, setActive] = useState<NavId>("calculator");

  // Hooks
  const t = useTranslations("calculator.bottomNav");

  return (
    <footer className={styles.footer}>
      {NAV_ITEMS.map(({ id, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => setActive(id)}
          className={`${styles.navItem} ${active === id ? styles.navItemActive : ""}`}
        >
          <Icon className={shared.iconSvg} aria-hidden />
          <span className={styles.label}>{t(id)}</span>
        </button>
      ))}
    </footer>
  );
};
