"use client";

// React
import { useMemo, useState } from "react";
// Libraries
import { useForm, useWatch } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
// Hooks
import { usePersistor } from "@/hooks";
// Components
import { CalculatorPageSkeleton } from "@/components/CalculatorPageSkeleton";
import { TopBar } from "@/components/TopBar";
import { LoanForm } from "@/components/LoanForm";
import { ResultCards } from "@/components/ResultCards";
import { BalanceChart } from "@/components/BalanceChart";
import { AmortizationTable } from "@/components/AmortizationTable";
import { BottomNav } from "@/components/BottomNav";
// Utils
import { amortize, parseNum, parseMaskedMoney, toUsd } from "@/utils";
// Types
import type { FormState, ChartView, PageIntroCopy, TabView } from "@/types";
// Styles
import shared from "@/shared";
import styles from "./AmortizationCalculator.module.css";

// Constants
const LOAN_CALC_FORM_COOKIE = "amortiza_loan_form_v1";

const DEFAULT_FORM: FormState = {
  amount: "450,000",
  rate: "6.5",
  years: "30",
  extra: "500",
  currency: "USD",
  extraFrequency: "monthly",
};

const TABS: TabView[] = ["chart", "table"];

type Props = Readonly<{
  pageIntro: PageIntroCopy;
}>;

type LoadedProps = Readonly<{
  pageIntro: PageIntroCopy;
  /** Valores leídos de la cookie (o `DEFAULT_FORM` si no había datos válidos) — solo se usan como `defaultValues` en el primer montaje de `useForm`. */
  defaultFormValues: FormState;
}>;

const AmortizationCalculatorLoaded = ({
  pageIntro,
  defaultFormValues,
}: LoadedProps) => {
  const locale = useLocale();
  const t = useTranslations("calculator");
  // Hooks
  const loanForm = useForm<FormState>({
    defaultValues: defaultFormValues,
  });
  const form = useWatch({ control: loanForm.control }) as FormState;
  usePersistor(LOAN_CALC_FORM_COOKIE, DEFAULT_FORM, form, {
    readOnMount: false,
    persistOnChange: true,
  });
  // State
  const [chartView, setChartView] = useState<ChartView>("Monthly");
  const [activeTab, setActiveTab] = useState<TabView>("chart");

  // Actions
  const handleSelectTab = (tab: TabView) => {
    setActiveTab(tab);
    document
      .getElementById(`tabpanel-${tab}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Values
  const result = useMemo(
    () =>
      amortize(
        toUsd(
          parseMaskedMoney(form.amount, locale, form.currency),
          form.currency,
        ),
        parseNum(form.rate),
        parseNum(form.years),
        toUsd(
          parseMaskedMoney(form.extra, locale, form.currency),
          form.currency,
        ),
        form.extraFrequency,
      ),
    [form, locale],
  );

  return (
    <>
      <TopBar />
      <main className={styles.main}>
        <div className={styles.grid}>
          <LoanForm methods={loanForm} />
          <section
            id="calc-results"
            className={styles.results}
            aria-label={t("results.interestSaved")}
          >
            <ResultCards currency={form.currency} result={result} />
          </section>
        </div>

        <div
          role="tablist"
          aria-label={t("table.title")}
          className={styles.tabBar}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              role="tab"
              type="button"
              id={`tab-${tab}`}
              aria-selected={activeTab === tab}
              aria-controls={`tabpanel-${tab}`}
              tabIndex={activeTab === tab ? 0 : -1}
              onClick={() => handleSelectTab(tab)}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""}`}
            >
              {tab === "chart" ? t("chart.title") : t("table.title")}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id="tabpanel-chart"
          aria-labelledby="tab-chart"
          hidden={activeTab !== "chart"}
        >
          <BalanceChart
            currency={form.currency}
            result={result}
            view={chartView}
            setView={setChartView}
          />
        </div>
        <div
          role="tabpanel"
          id="tabpanel-table"
          aria-labelledby="tab-table"
          hidden={activeTab !== "table"}
        >
          <AmortizationTable currency={form.currency} result={result} />
        </div>

        <section
          className={styles.pageIntro}
          aria-labelledby="seo-page-summary-heading"
        >
          <div className={shared.card}>
            <h2
              id="seo-page-summary-heading"
              className={`${shared.sectionTitle} ${styles.pageIntroTitle}`}
            >
              {pageIntro.heading}
            </h2>
            <h3 className={styles.pageIntroSubheading}>
              {pageIntro.purposeHeading}
            </h3>
            <p className={styles.pageIntroBody}>{pageIntro.purposeBody}</p>
            <h3 className={styles.pageIntroSubheading}>
              {pageIntro.usageHeading}
            </h3>
            <p className={styles.pageIntroBody}>{pageIntro.usageBody}</p>
          </div>
        </section>
      </main>
      <BottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />
    </>
  );
};

export const AmortizationCalculator = ({ pageIntro }: Props) => {
  const t = useTranslations("calculator");
  // Hooks
  const { valueFromStorage, isHydrated: persistHydrated } = usePersistor(
    LOAN_CALC_FORM_COOKIE,
    DEFAULT_FORM,
    DEFAULT_FORM,
    { persistOnChange: false },
  );

  if (!persistHydrated) {
    const noopSelectTab = (_tab: TabView): void => {
      /* Shell only — navigation wires up after hydrate */
    };

    return (
      <>
        <TopBar />
        <main
          className={styles.main}
          aria-busy="true"
          aria-label={t("loading")}
        >
          <CalculatorPageSkeleton
            variant="embedded"
            srLabel={t("loading")}
          />
        </main>
        <BottomNav activeTab="chart" onSelectTab={noopSelectTab} />
      </>
    );
  }

  return (
    <AmortizationCalculatorLoaded
      pageIntro={pageIntro}
      defaultFormValues={valueFromStorage}
    />
  );
};
