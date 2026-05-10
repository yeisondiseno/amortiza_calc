"use client";

// React
import { type Dispatch, type SetStateAction, useMemo } from "react";
// Libraries
import { Controller, useForm, type Control } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import {
  HiOutlineCalculator,
  HiOutlineInformationCircle,
} from "react-icons/hi";
// Components
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
// Constants
import { CURRENCY_CODES, type CurrencyCode } from "@/constants";
// Types
import type { FormState } from "@/types";
// Utils
import { narrowCurrencySymbol } from "@/utils";
// Styles
import shared from "@/shared";
import styles from "./LoanForm.module.css";

type Props = {
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
};

type NumericFormField = Exclude<keyof FormState, "currency">;

type FieldRowProps = {
  control: Control<FormState>;
  name: NumericFormField;
  label: string;
  prefix?: string;
  suffix?: string;
  placeholder: string;
  setForm: Dispatch<SetStateAction<FormState>>;
};

const FieldRow = ({
  control,
  name,
  label,
  prefix,
  suffix,
  placeholder,
  setForm,
}: FieldRowProps) => (
  <div className={styles.field}>
    <label className={shared.label}>{label}</label>
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className={shared.inputWrapper}>
          {prefix && <span className={shared.adornment}>{prefix}</span>}
          <Input
            ref={field.ref}
            name={field.name}
            className={shared.inputField}
            type="text"
            inputMode="decimal"
            placeholder={placeholder}
            value={field.value}
            onBlur={field.onBlur}
            onChange={(e) => {
              const v = e.target.value;
              field.onChange(v);
              setForm((prev) => ({ ...prev, [name]: v }));
            }}
          />
          {suffix && <span className={shared.adornment}>{suffix}</span>}
        </div>
      )}
    />
  </div>
);

export const LoanForm = ({ form, setForm }: Props) => {
  // Hooks
  const t = useTranslations("calculator.form");
  const locale = useLocale();
  const currencyNames = useMemo(
    () => new Intl.DisplayNames(locale, { type: "currency" }),
    [locale],
  );
  const currencySymbol = narrowCurrencySymbol(form.currency, locale);
  const { control } = useForm<FormState>({
    values: form,
  });

  return (
    <section className={styles.section}>
      {/* Loan parameters card */}
      <div className={shared.card}>
        <h2 className={`${shared.sectionTitle} ${styles.cardTitle}`}>
          {t("title")}
        </h2>
        <div className={styles.fields}>
          <div className={styles.amountCurrencyRow}>
            <FieldRow
              control={control}
              name="amount"
              label={t("loanAmount")}
              prefix={currencySymbol}
              placeholder="450,000"
              setForm={setForm}
            />
            <div className={styles.currencyField}>
              <label className={shared.label} htmlFor="loan-currency">
                {t("currency")}
              </label>
              <Controller
                control={control}
                name="currency"
                render={({ field }) => (
                  <div className={shared.inputWrapper}>
                    <Select
                      id="loan-currency"
                      ref={field.ref}
                      name={field.name}
                      value={field.value}
                      aria-label={t("currency")}
                      className={styles.currencySelectInner}
                      onBlur={field.onBlur}
                      onChange={(e) => {
                        const next = e.target.value as CurrencyCode;
                        field.onChange(next);
                        setForm((prev) => ({
                          ...prev,
                          currency: next,
                        }));
                      }}
                    >
                      {CURRENCY_CODES.map((code) => (
                        <option key={code} value={code}>
                          {`${code} — ${currencyNames.of(code) ?? code}`}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
              />
            </div>
          </div>

          <div className={styles.twoCol}>
            <FieldRow
              control={control}
              name="rate"
              label={t("interestRate")}
              suffix="%"
              placeholder="6.5"
              setForm={setForm}
            />
            <FieldRow
              control={control}
              name="years"
              label={t("loanTerm")}
              suffix={t("yearsSuffix")}
              placeholder="30"
              setForm={setForm}
            />
          </div>
          <FieldRow
            control={control}
            name="extra"
            label={t("extraPayment")}
            prefix={currencySymbol}
            placeholder="500"
            setForm={setForm}
          />
        </div>
        <button type="button" className={shared.btnCalculate}>
          <HiOutlineCalculator className={shared.iconSvgSm} aria-hidden />
          {t("calculate")}
        </button>
      </div>

      {/* Info card */}
      <div className={shared.cardSubtle}>
        <div className={styles.infoRow}>
          <HiOutlineInformationCircle
            className={`${shared.iconSvg} ${styles.infoIcon}`}
            aria-hidden
          />
          <p className={styles.infoText}>{t("infoText")}</p>
        </div>
      </div>
    </section>
  );
};
