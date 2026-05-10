"use client";

// React
import { useState, useMemo } from "react";
// Libraries
import { useLocale } from "next-intl";
// Components
import { TopBar } from "@/components/TopBar";
import { LoanForm } from "@/components/LoanForm";
import { ResultCards } from "@/components/ResultCards";
import { BalanceChart } from "@/components/BalanceChart";
import { AmortizationTable } from "@/components/AmortizationTable";
import { BottomNav } from "@/components/BottomNav";
// Utils
import { amortize, parseNum, parseMaskedMoney, toUsd } from "@/utils";
// Types
import type { FormState, ChartView } from "@/types";
// Styles
import styles from "./AmortizationCalculator.module.css";
// Constants
const DEFAULT_FORM: FormState = {
  amount: "450,000",
  rate: "6.5",
  years: "30",
  extra: "500",
  currency: "USD",
  extraFrequency: "monthly",
};

export const AmortizationCalculator = () => {
  const locale = useLocale();
  // State
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [chartView, setChartView] = useState<ChartView>("Monthly");

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
          <LoanForm form={form} setForm={setForm} />
          <section className={styles.results}>
            <ResultCards currency={form.currency} result={result} />
            <BalanceChart
              currency={form.currency}
              result={result}
              view={chartView}
              setView={setChartView}
            />
          </section>
        </div>
        <AmortizationTable currency={form.currency} result={result} />
      </main>
      <BottomNav />
    </>
  );
};
