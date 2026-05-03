"use client";

// React
import { useState, useMemo } from "react";

// Libraries
import { useTranslations } from "next-intl";

// Components
import { AmortizationTable } from "./AmortizationTable";
import { Input } from "@/components/ui/input";

// Styles
import styles from "./AmortizationCalculator.module.css";

// Types (module-local)
type TermUnit = "years" | "months";
type Tab = "calculator" | "table";

type FormData = {
  loanAmount: string;
  interestRate: string;
  term: string;
  termUnit: TermUnit;
  extraPayment: string;
};

export type AmortizationRow = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

type Results = {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  schedule: AmortizationRow[];
  withExtra: {
    totalInterest: number;
    totalCost: number;
    monthsSaved: number;
    interestSaved: number;
    schedule: AmortizationRow[];
  } | null;
};

// Constants
const DEFAULT_FORM: FormData = {
  loanAmount: "",
  interestRate: "",
  term: "",
  termUnit: "years",
  extraPayment: "",
};

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const buildSchedule = (
  principal: number,
  monthlyRate: number,
  termMonths: number,
  extra: number
): { schedule: AmortizationRow[]; totalInterest: number } => {
  const basePayment =
    monthlyRate === 0
      ? principal / termMonths
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1);

  const schedule: AmortizationRow[] = [];
  let balance = principal;
  let totalInterest = 0;

  for (let month = 1; balance > 0.005 && month <= termMonths * 2; month++) {
    const interest = balance * monthlyRate;
    const principalPart = Math.min(basePayment - interest + extra, balance);
    const payment = principalPart + interest;
    balance = Math.max(0, balance - principalPart);
    totalInterest += interest;
    schedule.push({ month, payment, principal: principalPart, interest, balance });
  }

  return { schedule, totalInterest };
};

export const AmortizationCalculator = () => {
  // State
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [activeTab, setActiveTab] = useState<Tab>("calculator");
  const [results, setResults] = useState<Results | null>(null);

  // Hooks
  const t = useTranslations("calculator");

  // Actions
  const handleChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleCalculate = () => {
    const amount = parseFloat(form.loanAmount);
    const rate = parseFloat(form.interestRate);
    const termMonths =
      form.termUnit === "years"
        ? parseFloat(form.term) * 12
        : parseFloat(form.term);
    const extra = parseFloat(form.extraPayment) || 0;

    if (!amount || !rate || !termMonths || amount <= 0 || termMonths <= 0) return;

    const monthlyRate = rate / 100 / 12;
    const { schedule, totalInterest } = buildSchedule(amount, monthlyRate, termMonths, 0);
    const monthlyPayment = schedule[0]?.payment ?? 0;

    let withExtra = null;
    if (extra > 0) {
      const { schedule: es, totalInterest: ei } = buildSchedule(amount, monthlyRate, termMonths, extra);
      withExtra = {
        totalInterest: ei,
        totalCost: amount + ei,
        monthsSaved: schedule.length - es.length,
        interestSaved: totalInterest - ei,
        schedule: es,
      };
    }

    setResults({ monthlyPayment, totalInterest, totalCost: amount + totalInterest, schedule, withExtra });
  };

  // Values
  const displaySchedule = useMemo(
    () => (results?.withExtra ? results.withExtra.schedule : results?.schedule ?? []),
    [results]
  );

  return (
    <div className={styles.calculator}>
      <header className={styles.header}>
        <h1 className={styles.heading}>{t("title")}</h1>
        <p className={styles.subtitle}>{t("subtitle")}</p>
      </header>

      <nav className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "calculator" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("calculator")}
        >
          {t("tabs.calculator")}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "table" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("table")}
          disabled={!results}
        >
          {t("tabs.table")}
        </button>
      </nav>

      {activeTab === "calculator" && (
        <div className={styles.content}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>{t("form.title")}</h2>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label}>{t("form.loanAmount")}</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.adornment}>$</span>
                  <Input className={styles.inputField} type="number" placeholder="0.00" value={form.loanAmount} onChange={handleChange("loanAmount")} min="0" />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t("form.interestRate")}</label>
                <div className={styles.inputWrapper}>
                  <Input className={styles.inputField} type="number" placeholder="0.00" value={form.interestRate} onChange={handleChange("interestRate")} min="0" max="100" step="0.01" />
                  <span className={styles.adornment}>%</span>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t("form.loanTerm")}</label>
                <div className={styles.termRow}>
                  <div className={styles.inputWrapper}>
                    <Input className={styles.inputField} type="number" placeholder="0" value={form.term} onChange={handleChange("term")} min="0" />
                  </div>
                  <div className={styles.segmented}>
                    <button type="button" className={`${styles.segBtn} ${form.termUnit === "years" ? styles.segActive : ""}`} onClick={() => setForm((p) => ({ ...p, termUnit: "years" }))}>
                      {t("form.years")}
                    </button>
                    <button type="button" className={`${styles.segBtn} ${form.termUnit === "months" ? styles.segActive : ""}`} onClick={() => setForm((p) => ({ ...p, termUnit: "months" }))}>
                      {t("form.months")}
                    </button>
                  </div>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t("form.extraPayment")}</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.adornment}>$</span>
                  <Input className={styles.inputField} type="number" placeholder="0.00" value={form.extraPayment} onChange={handleChange("extraPayment")} min="0" />
                </div>
              </div>
            </div>
            <button className={styles.calculateBtn} type="button" onClick={handleCalculate}>
              {t("form.calculate")}
            </button>
          </section>

          {results && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>{t("results.title")}</h2>
              <div className={styles.resultHighlight}>
                <span className={styles.resultLabel}>{t("results.monthlyPayment")}</span>
                <span className={styles.numberDisplay}>${fmt(results.monthlyPayment)}</span>
              </div>
              <div className={styles.resultRows}>
                <div className={styles.resultRow}>
                  <span>{t("results.totalInterest")}</span>
                  <span className={styles.resultValue}>${fmt(results.totalInterest)}</span>
                </div>
                <div className={styles.resultRow}>
                  <span>{t("results.totalCost")}</span>
                  <span className={styles.resultValue}>${fmt(results.totalCost)}</span>
                </div>
                {results.withExtra && (
                  <>
                    <div className={styles.resultRow}>
                      <span>{t("results.interestSaved")}</span>
                      <span className={`${styles.resultValue} ${styles.savingsValue}`}>
                        -${fmt(results.withExtra.interestSaved)}
                      </span>
                    </div>
                    <div className={styles.resultRow}>
                      <span>{t("results.monthsSaved")}</span>
                      <span className={`${styles.resultValue} ${styles.savingsValue}`}>
                        {results.withExtra.monthsSaved} {t("results.months")}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </section>
          )}
        </div>
      )}

      {activeTab === "table" && results && (
        <AmortizationTable schedule={displaySchedule} />
      )}
    </div>
  );
};
