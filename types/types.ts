import type { CurrencyCode } from "@/constants";

export type AmortizationRow = {
  month: number;
  principal: number;
  interest: number;
  extra: number;
  balance: number;
};

export type LoanResult = {
  basePayment: number;
  stdInterest: number;
  accInterest: number;
  interestSaved: number;
  interestSavedPct: number;
  yearsSaved: number;
  monthsToPayoff: number;
  rows: AmortizationRow[];
  stdSeries: number[];
  accSeries: number[];
  n: number;
};

export type ExtraPaymentFrequency = "monthly" | "annual";

/** `extra` es el monto del pago adicional mensual **o** anual según `extraFrequency`. */
export type FormState = {
  amount: string;
  rate: string;
  years: string;
  extra: string;
  currency: CurrencyCode;
  extraFrequency: ExtraPaymentFrequency;
};

export type ChartView = "Monthly" | "Annually";
