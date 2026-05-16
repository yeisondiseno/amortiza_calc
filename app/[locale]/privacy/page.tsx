// Next
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

// Constants
import { BASE_URL } from "@/constants";

type Props = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params;
  return {
    title: "Privacy Policy",
    description:
      "Privacy policy for Loan Payoff Calculator. We do not collect, store, or share any personal or financial data. All calculations run locally in your browser.",
    alternates: {
      canonical: `${BASE_URL}/${locale}/privacy`,
    },
    robots: { index: false },
  };
};

const PrivacyPage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "48px 24px",
        fontFamily: "var(--font-inter, system-ui, sans-serif)",
        lineHeight: 1.7,
        color: "#e2e8f0",
      }}
    >
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>
        Privacy Policy
      </h1>
      <p style={{ color: "#94a3b8", fontSize: 14 }}>
        Last updated: May 2026
      </p>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 32 }}>
        Data we collect
      </h2>
      <p>
        We do not collect, store, or transmit any personal or financial data.
        All loan calculations are performed locally in your browser and never
        leave your device.
      </p>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 32 }}>
        Cookies
      </h2>
      <p>
        This site does not use tracking cookies or analytics. Your loan
        history is saved in your browser&apos;s local storage and can be
        cleared at any time.
      </p>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 32 }}>
        Third-party services
      </h2>
      <p>
        We use Google Fonts to load web fonts. Google may log your IP address
        when fonts are fetched. No other third-party services are used.
      </p>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 32 }}>
        Contact
      </h2>
      <p>
        If you have any questions about this privacy policy, you can reach us
        via the contact information on our website.
      </p>
    </main>
  );
};

export default PrivacyPage;
