"use client";

// Libraries
import { useLocale, useTranslations } from "next-intl";
// i18n
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
// Components
import { Logo } from "@/components/Logo";
import { Select } from "@/components/Select";
// Styles
import styles from "./TopBar.module.css";

const LOCALE_LABELS: Record<(typeof routing.locales)[number], string> = {
  es: "Español",
  en: "English",
  de: "Deutsch",
  fr: "Français",
  pt: "Português",
  ja: "日本語",
};

export const TopBar = () => {
  // Hooks
  const t = useTranslations("calculator.topbar");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const onLocaleChange = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Wordmark */}
        <Logo variant="primary" height={32} />

        {/* Actions */}
        <div className={styles.actions}>
          <Select
            shellClassName={styles.langShell}
            value={locale}
            onChange={(e) => onLocaleChange(e.target.value)}
            aria-label={t("language")}
          >
            {routing.locales.map((loc) => (
              <option key={loc} value={loc}>
                {LOCALE_LABELS[loc]}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </header>
  );
};
