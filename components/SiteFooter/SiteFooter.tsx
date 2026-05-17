// Libraries
import { getTranslations } from "next-intl/server";
// Components (local)
import { Link } from "@/i18n/navigation";
// Constants
import { routing } from "@/i18n/routing";
// Styles
import styles from "./SiteFooter.module.css";

type Props = Readonly<{
  locale: string;
}>;

export const SiteFooter = async ({ locale }: Props) => {
  const t = await getTranslations({ locale, namespace: "footer" });
  const tg = await getTranslations({ locale, namespace: "global" });

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.brandLine}>
          {t("brandLine", {
            brand: t("brand"),
            footer: t("footer"),
          })}
        </p>
        <p className={styles.disclaimer}>{t("disclaimer")}</p>
        <nav className={styles.metaNav} aria-label={t("metaNavAria")}>
          <Link href="/about" className={styles.metaLink}>
            {t("about")}
          </Link>
          <Link href="/privacy" className={styles.metaLink}>
            {t("privacy")}
          </Link>
        </nav>
        <nav className={styles.langNav} aria-label={tg("langsNavAria")}>
          {routing.locales.map((loc) => (
            <Link
              key={loc}
              href="/"
              locale={loc}
              lang={loc}
              className={styles.langLink}
            >
              {tg(`languageNames.${loc}`)}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};
