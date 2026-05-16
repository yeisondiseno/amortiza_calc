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
    title: "About",
    description:
      "Learn about the free Loan Payoff Calculator — a tool to help you understand your amortization schedule and plan extra payments to pay off debt faster.",
    alternates: {
      canonical: `${BASE_URL}/${locale}/about`,
    },
  };
};

const AboutPage = async ({ params }: Props) => {
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
        About Loan Payoff Calculator
      </h1>
      <p>
        Loan Payoff Calculator is a free, privacy-first tool that helps you
        understand exactly how your loan works — and how extra payments can save
        you thousands of dollars in interest.
      </p>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 32 }}>
        What it does
      </h2>
      <p>
        Enter your loan amount, interest rate, and term to instantly see your
        monthly payment and a full amortization schedule. Add optional extra
        monthly or annual payments to compare scenarios side by side.
      </p>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 32 }}>
        Who it is for
      </h2>
      <p>
        Anyone with a fixed-rate loan — mortgage, auto loan, student loan, or
        personal loan — who wants to plan smarter repayment and reduce total
        interest paid.
      </p>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 32 }}>
        Privacy
      </h2>
      <p>
        All calculations happen entirely in your browser. No personal data,
        financial information, or loan details are ever sent to our servers.
      </p>
    </main>
  );
};

export default AboutPage;
