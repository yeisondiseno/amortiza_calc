// Next
import { getTranslations, setRequestLocale } from "next-intl/server";

// Components
import { AmortizationCalculator } from "@/components";

type Props = Readonly<{
  params: Promise<{ locale: string }>;
}>;

// Constants
const BASE_URL = "https://loanpayoff.info";

const Home = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "App" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("title"),
    url: `${BASE_URL}/${locale}`,
    description: t("description"),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    inLanguage: locale,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">{t("title")}</h1>
      <AmortizationCalculator />
    </>
  );
};

export default Home;
