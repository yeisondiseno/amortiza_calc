"use client";

// React
import { useState, useMemo } from "react";

// Components
import { TopBar } from "./TopBar";
import { LoanForm } from "./LoanForm";
import { ResultCards } from "./ResultCards";
import { BalanceChart } from "./BalanceChart";
import { AmortizationTable } from "./AmortizationTable";
import { BottomNav } from "./BottomNav";

// Utils
import { amortize, parseNum } from "./utils";

// Types
import type { FormState, ChartView } from "./types";

// Styles
import styles from "./AmortizationCalculator.module.css";

// Constants
const DEFAULT_FORM: FormState = {
  amount: "450,000",
  rate: "6.5",
  years: "30",
  extra: "500",
};

export const AmortizationCalculator = () => {
  // State
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [chartView, setChartView] = useState<ChartView>("Monthly");

  // Values
  const result = useMemo(
    () =>
      amortize(
        parseNum(form.amount),
        parseNum(form.rate),
        parseNum(form.years),
        parseNum(form.extra),
      ),
    [form],
  );

  return (
    <>
      <TopBar />
      <main className={styles.main}>
        <div className={styles.grid}>
          <LoanForm form={form} setForm={setForm} />
          <section className={styles.results}>
            <ResultCards result={result} />
            <BalanceChart
              result={result}
              view={chartView}
              setView={setChartView}
            />
          </section>
        </div>
        <AmortizationTable result={result} />
      </main>
      <BottomNav />
    </>
  );
};
