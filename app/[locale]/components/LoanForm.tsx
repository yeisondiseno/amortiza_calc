"use client";

// Libraries
import { useTranslations } from "next-intl";

// Components
import { Input } from "@/components/ui/input";

// Types
import type { FormState } from "./types";

// Styles
import shared from "./shared.module.css";
import styles from "./LoanForm.module.css";

type Props = {
  form: FormState;
  setForm: (form: FormState) => void;
};

// Types (module-local)
type FieldProps = {
  label: string;
  prefix?: string;
  suffix?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
};

const Field = ({ label, prefix, suffix, value, onChange, placeholder }: FieldProps) => (
  <div className={styles.field}>
    <label className={shared.label}>{label}</label>
    <div className={shared.inputWrapper}>
      {prefix && <span className={shared.adornment}>{prefix}</span>}
      <Input
        className={shared.inputField}
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {suffix && <span className={shared.adornment}>{suffix}</span>}
    </div>
  </div>
);

export const LoanForm = ({ form, setForm }: Props) => {
  // Hooks
  const t = useTranslations("calculator.form");

  // Actions
  const update = (key: keyof FormState) => (v: string) =>
    setForm({ ...form, [key]: v });

  return (
    <section className={styles.section}>
      {/* Loan parameters card */}
      <div className={shared.card}>
        <h2 className={`${shared.sectionTitle} ${styles.cardTitle}`}>{t("title")}</h2>
        <div className={styles.fields}>
          <Field
            label={t("loanAmount")}
            prefix="$"
            value={form.amount}
            onChange={update("amount")}
            placeholder="450,000"
          />
          <div className={styles.twoCol}>
            <Field
              label={t("interestRate")}
              suffix="%"
              value={form.rate}
              onChange={update("rate")}
              placeholder="6.5"
            />
            <Field
              label={t("loanTerm")}
              suffix={t("yearsSuffix")}
              value={form.years}
              onChange={update("years")}
              placeholder="30"
            />
          </div>
          <Field
            label={t("extraPayment")}
            prefix="$"
            value={form.extra}
            onChange={update("extra")}
            placeholder="500"
          />
        </div>
        <button type="button" className={shared.btnCalculate}>
          <span className={shared.iconSm}>calculate</span>
          {t("calculate")}
        </button>
      </div>

      {/* Info card */}
      <div className={shared.cardSubtle}>
        <div className={styles.infoRow}>
          <span className={`${shared.icon} ${styles.infoIcon}`}>info</span>
          <p className={styles.infoText}>{t("infoText")}</p>
        </div>
      </div>
    </section>
  );
};
