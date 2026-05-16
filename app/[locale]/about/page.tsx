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
  const t = await getTranslations({ locale, namespace: "aboutPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/about`,
    },
  };
};

const AboutPage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "aboutPage" });
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
        <p className={staticStyles.lead}>{t("intro")}</p>
        <h2
          className={`${staticStyles.subheading} ${staticStyles.subheadingFirst}`}
        >
          {t("whatTitle")}
        </h2>
        <p className={staticStyles.paragraph}>{t("whatBody")}</p>
        <h2 className={staticStyles.subheading}>{t("whoTitle")}</h2>
        <p className={staticStyles.paragraph}>{t("whoBody")}</p>
        <h2 className={staticStyles.subheading}>{t("privacyTitle")}</h2>
        <p className={staticStyles.paragraph}>{t("privacyBody")}</p>
      </article>
    </main>
    </>
  );
};

export default AboutPage;
