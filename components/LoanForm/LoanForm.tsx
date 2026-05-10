"use client";

// React
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
} from "react";
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
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
};

type NumericFormField = Exclude<keyof FormState, "currency" | "extraFrequency">;

type FieldRowProps = {
  control: Control<FormState>;
  name: NumericFormField;
  label: string;
  prefix?: string;
  suffix?: string;
  placeholder: string;
  setForm: Dispatch<SetStateAction<FormState>>;
};

type MoneyFieldRowProps = {
  control: Control<FormState>;
  name: "amount" | "extra";
  label: string;
  prefix?: string;
  placeholder: string;
  setForm: Dispatch<SetStateAction<FormState>>;
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

const MoneyFieldRow = ({
  control,
  name,
  label,
  prefix,
  placeholder,
  setForm,
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
              const finalized = finalizeMoneyDisplay(
                e.target.value,
                locale,
                currency,
              );
              field.onChange(finalized);
              setForm((prev) => ({ ...prev, [name]: finalized }));
            }}
            onChange={(e) => {
              const masked = maskMoneyInput(e.target.value, locale, currency);
              field.onChange(masked);
              setForm((prev) => ({ ...prev, [name]: masked }));
            }}
          />
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

  const placeholderLoan = useMemo(
    () => placeholderMoney(450_000, locale, form.currency),
    [locale, form.currency],
  );
  const placeholderExtra = useMemo(
    () =>
      form.extraFrequency === "monthly"
        ? placeholderMoney(500, locale, form.currency)
        : placeholderMoney(12_000, locale, form.currency),
    [locale, form.currency, form.extraFrequency],
  );

  useEffect(() => {
    setForm((prev) => {
      const nextAmount =
        prev.amount.trim() === ""
          ? ""
          : finalizeMoneyDisplay(prev.amount, locale, prev.currency);
      const nextExtra =
        prev.extra.trim() === ""
          ? ""
          : finalizeMoneyDisplay(prev.extra, locale, prev.currency);
      if (nextAmount === prev.amount && nextExtra === prev.extra) {
        return prev;
      }
      return { ...prev, amount: nextAmount, extra: nextExtra };
    });
  }, [locale, form.currency, setForm]);

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
              setForm={setForm}
              locale={locale}
              currency={form.currency}
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
                      onClick={() => {
                        field.onChange("monthly");
                        setForm((p) => ({
                          ...p,
                          extraFrequency: "monthly",
                        }));
                      }}
                    >
                      {t("extraFrequencyMonthly")}
                    </button>
                    <button
                      type="button"
                      aria-pressed={field.value === "annual"}
                      className={`${styles.freqBtn} ${field.value === "annual" ? styles.freqBtnActive : ""}`}
                      onClick={() => {
                        field.onChange("annual");
                        setForm((p) => ({
                          ...p,
                          extraFrequency: "annual",
                        }));
                      }}
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
              form.extraFrequency === "monthly"
                ? t("extraPaymentMonthly")
                : t("extraPaymentAnnual")
            }
            prefix={currencySymbol}
            placeholder={placeholderExtra}
            setForm={setForm}
            locale={locale}
            currency={form.currency}
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
