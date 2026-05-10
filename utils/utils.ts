import type { LoanResult } from "@/types";

export const parseNum = (s: string): number =>
  Number(String(s).replace(/[^0-9.\-]/g, "")) || 0;

export const formatUSD = (n: number, decimals = 0): string => {
  if (!isFinite(n)) return "$0";
  return (
    "$" +
    n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
};

export const payoffDate = (monthsFromNow: number): string => {
  const d = new Date();
  d.setMonth(d.getMonth() + monthsFromNow);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

export const rowDate = (monthIndex: number): string => {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + monthIndex);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

export const amortize = (
  principal: number,
  annualRatePct: number,
  years: number,
  extraMonthly: number,
): LoanResult | null => {
  if (principal <= 0 || years <= 0) return null;

  const n = Math.max(1, Math.round(years * 12));
  const r = annualRatePct / 100 / 12;

  const basePayment =
    r === 0
      ? principal / n
      : (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);

  // Standard schedule (no extra)
  let bal = principal;
  let stdInterest = 0;
  const stdSeries: number[] = [bal];
  for (let i = 0; i < n; i++) {
    const interest = bal * r;
    const principalPay = Math.min(basePayment - interest, bal);
    stdInterest += interest;
    bal = Math.max(0, bal - principalPay);
    stdSeries.push(bal);
  }

  // Accelerated schedule (with extra)
  let bal2 = principal;
  let accInterest = 0;
  const rows: LoanResult["rows"] = [];
  const accSeries: number[] = [bal2];
  let monthsToPayoff = 0;
  for (let i = 0; i < n && bal2 > 0.01; i++) {
    const interest = bal2 * r;
    const principalPay = Math.min(basePayment - interest, bal2);
    const extra = Math.min(extraMonthly, Math.max(0, bal2 - principalPay));
    bal2 = Math.max(0, bal2 - principalPay - extra);
    accInterest += interest;
    accSeries.push(bal2);
    rows.push({
      month: i,
      principal: principalPay,
      interest,
      extra,
      balance: bal2,
    });
    monthsToPayoff = i + 1;
  }

  return {
    basePayment,
    stdInterest,
    accInterest,
    interestSaved: Math.max(0, stdInterest - accInterest),
    interestSavedPct:
      stdInterest > 0 ? ((stdInterest - accInterest) / stdInterest) * 100 : 0,
    yearsSaved: Math.max(0, (n - monthsToPayoff) / 12),
    monthsToPayoff,
    rows,
    stdSeries,
    accSeries,
    n,
  };
};
