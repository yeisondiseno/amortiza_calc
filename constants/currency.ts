/** Unidades de moneda nacional por **1 USD** (referencia fija para la demo). No son tipos EN VIVO. */
export const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  COP: 4200,
  MXN: 17.2,
  BRL: 5,
  ARS: 870,
  JPY: 150,
  CNY: 7.25,
  INR: 83.5,
  CAD: 1.36,
  AUD: 1.54,
  CHF: 0.88,
  KRW: 1340,
} as const;

export type CurrencyCode = keyof typeof EXCHANGE_RATES;

export const CURRENCY_CODES: CurrencyCode[] = (
  Object.keys(EXCHANGE_RATES) as CurrencyCode[]
).slice().sort((a, b) => a.localeCompare(b));
