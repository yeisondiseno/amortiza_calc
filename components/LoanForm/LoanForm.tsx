"use client";

// React
import { useEffect, useId, useMemo } from "react";
// Libraries
import {
  Controller,
  useWatch,
  type Control,
  type UseFormReturn,
} from "react-hook-form";
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
import {
  finalizeMoneyDisplay,
  maskMoneyInput,
  narrowCurrencySymbol,
  placeholderMoney,
} from "@/utils";
// Styles
import shared from "@/shared";
import styles from "./LoanForm.module.css";

type Props = {
  methods: UseFormReturn<FormState>;
};

type NumericFormField = Exclude<keyof FormState, "currency" | "extraFrequency">;

type FieldRowProps = {
  control: Control<FormState>;
  name: NumericFormField;
  label: string;
  prefix?: string;
  suffix?: string;
  placeholder: string;
};

type MoneyFieldRowProps = {
  control: Control<FormState>;
  name: "amount" | "extra";
  label: string;
  prefix?: string;
  placeholder: string;
  locale: string;
  currency: CurrencyCode;
};

const FieldRow = ({
  control,
  name,
  label,
  prefix,
  suffix,
  placeholder,
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
            onChange={(e) => field.onChange(e.target.value)}
          />
          {suffix && <span className={shared.adornment}>{suffix}</span>}
        </div>
      )}
    />
  </div>
);

const MoneyFieldRow = ({
  control,
  name,
  label,
  prefix,
  placeholder,
  locale,
  currency,
}: MoneyFieldRowProps) => (
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
            onBlur={(e) => {
              field.onBlur();
              field.onChange(
                finalizeMoneyDisplay(e.target.value, locale, currency),
              );
            }}
            onChange={(e) =>
              field.onChange(maskMoneyInput(e.target.value, locale, currency))
            }
          />
        </div>
      )}
    />
  </div>
);

export const LoanForm = ({ methods }: Props) => {
  // Hooks
  const t = useTranslations("calculator.form");
  const locale = useLocale();
  const { control, setValue, getValues } = methods;
  const currency = useWatch({ control, name: "currency" });
  const extraFrequency = useWatch({ control, name: "extraFrequency" });
  const currencyNames = useMemo(
    () => new Intl.DisplayNames(locale, { type: "currency" }),
    [locale],
  );
  const currencySymbol = narrowCurrencySymbol(currency, locale);

  const placeholderLoan = useMemo(
    () => placeholderMoney(450_000, locale, currency),
    [locale, currency],
  );
  const placeholderExtra = useMemo(
    () =>
      extraFrequency === "monthly"
        ? placeholderMoney(500, locale, currency)
        : placeholderMoney(12_000, locale, currency),
    [locale, currency, extraFrequency],
  );

  useEffect(() => {
    const amount = getValues("amount");
    const extra = getValues("extra");
    const nextAmount =
      amount.trim() === ""
        ? ""
        : finalizeMoneyDisplay(amount, locale, currency);
    const nextExtra =
      extra.trim() === ""
        ? ""
        : finalizeMoneyDisplay(extra, locale, currency);
    if (nextAmount !== amount) setValue("amount", nextAmount);
    if (nextExtra !== extra) setValue("extra", nextExtra);
  }, [locale, currency, getValues, setValue]);

  return (
    <section className={styles.section}>
      {/* Loan parameters card */}
      <div className={shared.card}>
        <h2 className={`${shared.sectionTitle} ${styles.cardTitle}`}>
          {t("title")}
        </h2>
        <div className={styles.fields}>
          <div className={styles.amountCurrencyRow}>
            <MoneyFieldRow
              control={control}
              name="amount"
              label={t("loanAmount")}
              prefix={currencySymbol}
              placeholder={placeholderLoan}
              locale={locale}
              currency={currency}
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
                      onChange={(e) =>
                        field.onChange(e.target.value as CurrencyCode)
                      }
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
            />
            <FieldRow
              control={control}
              name="years"
              label={t("loanTerm")}
              suffix={t("yearsSuffix")}
              placeholder="30"
            />
          </div>
          <div className={styles.extraFreqRow}>
            <span className={shared.label} id="extra-freq-label">
              {t("extraFrequency")}
            </span>
            <Controller
              control={control}
              name="extraFrequency"
              render={({ field }) => (
                <fieldset
                  className={styles.freqFieldset}
                  aria-labelledby="extra-freq-label"
                >
                  <div className={styles.freqSegmented}>
                    <button
                      type="button"
                      aria-pressed={field.value === "monthly"}
                      className={`${styles.freqBtn} ${field.value === "monthly" ? styles.freqBtnActive : ""}`}
                      onClick={() => field.onChange("monthly")}
                    >
                      {t("extraFrequencyMonthly")}
                    </button>
                    <button
                      type="button"
                      aria-pressed={field.value === "annual"}
                      className={`${styles.freqBtn} ${field.value === "annual" ? styles.freqBtnActive : ""}`}
                      onClick={() => field.onChange("annual")}
                    >
                      {t("extraFrequencyAnnual")}
                    </button>
                  </div>
                </fieldset>
              )}
            />
          </div>
          <MoneyFieldRow
            control={control}
            name="extra"
            label={
              extraFrequency === "monthly"
                ? t("extraPaymentMonthly")
                : t("extraPaymentAnnual")
            }
            prefix={currencySymbol}
            placeholder={placeholderExtra}
            locale={locale}
            currency={currency}
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
