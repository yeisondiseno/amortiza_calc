// Next
import { getTranslations, setRequestLocale } from "next-intl/server";
// Components
import { AmortizationCalculator } from "@/components";
// Constants
import { BASE_URL } from "@/constants";

type Props = Readonly<{
  params: Promise<{ locale: string }>;
}>;

const Home = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "App" });
  const tFaq = await getTranslations({ locale, namespace: "faq" });
  const tSeo = await getTranslations({ locale, namespace: "seo" });

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("title"),
    url: `${BASE_URL}/${locale}`,
    description: t("description"),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    inLanguage: locale,
    browserRequirements: "Requires JavaScript",
    featureList: [
      "Loan amortization schedule",
      "Extra monthly payment calculator",
      "Extra annual payment calculator",
      "Interest savings estimator",
      "CSV export",
    ],
    creator: {
      "@type": "Organization",
      name: t("title"),
      url: BASE_URL,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [1, 2, 3, 4].map((i) => ({
      "@type": "Question",
      name: tFaq(`q${i}`),
      acceptedAnswer: {
        "@type": "Answer",
        text: tFaq(`a${i}`),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="sr-only">{t("title")}</h1>
      <AmortizationCalculator
        pageIntro={{
          heading: tSeo("heading"),
          purposeHeading: tSeo("purposeHeading"),
          purposeBody: tSeo("purposeBody"),
          usageHeading: tSeo("usageHeading"),
          usageBody: tSeo("usageBody"),
        }}
      />
    </>
  );
};

export default Home;
