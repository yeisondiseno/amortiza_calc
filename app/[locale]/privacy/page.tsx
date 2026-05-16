// Next
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HiOutlineArrowLeft } from "react-icons/hi";
// Components
import { TopBar } from "@/components";
// i18n
import { Link } from "@/i18n/navigation";
// Constants
import { BASE_URL } from "@/constants";
// Styles
import shared from "@/shared";
import staticStyles from "../staticPage.module.css";

type Props = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/privacy`,
    },
    robots: { index: false },
  };
};

const PrivacyPage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "privacyPage" });
  const tl = await getTranslations({ locale, namespace: "legal" });

  return (
    <>
      <TopBar />
      <main className={staticStyles.main}>
      <div className={staticStyles.backRow}>
        <Link
          href="/"
          className={`${shared.btnGhost} ${staticStyles.backLink}`}
        >
          <HiOutlineArrowLeft className={shared.iconSvgSm} aria-hidden />
          {tl("backToHome")}
        </Link>
      </div>
      <article className={`${shared.card} ${staticStyles.article}`}>
        <h1 className={shared.sectionTitle}>{t("title")}</h1>
        <p className={staticStyles.meta}>{t("updated")}</p>
        <h2
          className={`${staticStyles.subheading} ${staticStyles.subheadingFirst}`}
        >
          {t("dataTitle")}
        </h2>
        <p className={staticStyles.paragraph}>{t("dataBody")}</p>
        <h2 className={staticStyles.subheading}>{t("cookiesTitle")}</h2>
        <p className={staticStyles.paragraph}>{t("cookiesBody")}</p>
        <h2 className={staticStyles.subheading}>{t("thirdPartyTitle")}</h2>
        <p className={staticStyles.paragraph}>{t("thirdPartyBody")}</p>
        <h2 className={staticStyles.subheading}>{t("contactTitle")}</h2>
        <p className={staticStyles.paragraph}>{t("contactBody")}</p>
      </article>
    </main>
    </>
  );
};

export default PrivacyPage;
