"use client";

// Libraries
import { useTranslations } from "next-intl";
import {
  HiOutlineCalculator,
  HiOutlineCalendar,
} from "react-icons/hi";
// Types
import type { TabView } from "@/types";
// Styles
import shared from "@/shared";
import styles from "./BottomNav.module.css";

// Constants
const NAV_ITEMS = [
  { id: "calculator" as const, Icon: HiOutlineCalculator, target: "chart" as const },
  { id: "schedule" as const, Icon: HiOutlineCalendar, target: "table" as const },
] as const;

type NavId = (typeof NAV_ITEMS)[number]["id"];

type Props = Readonly<{
  activeTab: TabView;
  onSelectTab: (tab: TabView) => void;
}>;

export const BottomNav = ({ activeTab, onSelectTab }: Props) => {
  // Hooks
  const t = useTranslations("calculator.bottomNav");

  // Values
  const activeNav: NavId = activeTab === "table" ? "schedule" : "calculator";

  // Actions
  const handleClick = (target: TabView) => {
    if (target === "chart") {
      // "Calculator" tab — focus the form area at the top of the page
      onSelectTab("chart");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    onSelectTab(target);
  };

  return (
    <nav className={styles.footer} aria-label={t("calculator")}>
      {NAV_ITEMS.map(({ id, Icon, target }) => {
        const isActive = activeNav === id;
        return (
          <button
            key={id}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => handleClick(target)}
            className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
          >
            <Icon className={shared.iconSvg} aria-hidden />
            <span className={styles.label}>{t(id)}</span>
          </button>
        );
      })}
    </nav>
  );
};
