import type { CurrencyCode } from "@/constants";

export type MoneyMaskFormat = {
  groupSep: string;
  decimalSep: string;
  maxFrac: number;
};

/** Separadores y decimales permitidos por locale + código ISO de moneda. */
export function getMoneyMaskFormat(
  locale: string,
  currency: CurrencyCode,
): MoneyMaskFormat {
  const nfCur = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    numberingSystem: "latn",
  });
  const { maximumFractionDigits } = nfCur.resolvedOptions();
  const maxFrac = Math.min(
    12,
    Math.max(0, maximumFractionDigits ?? 2),
  );

  const groupSep =
    nfCur.formatToParts(987_654_321).find((p) => p.type === "group")?.value ??
    "";

  let decimalSep = "";
  if (maxFrac > 0) {
    decimalSep =
      nfCur.formatToParts(1234.5).find((p) => p.type === "decimal")?.value ??
      ".";
  }

  return { groupSep, decimalSep, maxFrac };
}

function isDigitLike(c: string): boolean {
  return /^[0-9]$/.test(c.normalize("NFKC"));
}

function digitNormalize(c: string): string {
  return c.normalize("NFKC");
}

/**
 * Cadena editable con agrupadores locales durante la escritura.
 * Si el usuario deja pendiente solo el decimal (`12.` o `12,`), se conserva.
 */
export function maskMoneyInput(
  raw: string,
  locale: string,
  currency: CurrencyCode,
): string {
  const { groupSep, decimalSep, maxFrac } = getMoneyMaskFormat(
    locale,
    currency,
  );

  let sIn = raw
    .replace(/\u202f|\u00a0/g, " ")
    .normalize("NFKC")
    .trimStart();

  if (sIn === "" || sIn === "-" || sIn === "\u2212") {
    return "";
  }

  let neg = false;
  if (sIn[0] === "-" || sIn[0] === "\u2212") {
    neg = true;
    sIn = sIn.slice(1);
  }

  let intDig = "";
  let fracDig = "";
  let decSeen = false;

  for (let k = 0; k < sIn.length; k += 1) {
    const c = sIn[k]!;

    if (isDigitLike(c)) {
      if (decSeen) {
        if (fracDig.length < maxFrac) {
          fracDig += digitNormalize(c);
        }
      } else if (intDig.length < 18) {
        intDig += digitNormalize(c);
      }
      continue;
    }

    if (groupSep && c === groupSep) continue;
    if (/\s/u.test(c)) continue;

    if (maxFrac > 0 && decimalSep && c === decimalSep && !decSeen) {
      decSeen = true;
      continue;
    }
  }

  let intNorm = intDig.replace(/^0+(?=\d)/u, "");
  if (intNorm === "" && fracDig.length > 0) {
    intNorm = "0";
  }

  if (decSeen && fracDig.length === 0 && maxFrac > 0) {
    const intVal = Number.parseInt(intNorm || "0", 10);
    const head = new Intl.NumberFormat(locale, {
      numberingSystem: "latn",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(intVal);

    const sign = neg && (intDig !== "" || intVal !== 0) ? "-" : "";
    return `${sign}${head}${decimalSep}`;
  }

  if (!decSeen && intNorm === "" && fracDig === "") {
    return "";
  }

  const numCore =
    fracDig !== ""
      ? Number.parseFloat(`${intNorm || "0"}.${fracDig}`)
      : Number.parseInt(intNorm || "0", 10);

  if (!Number.isFinite(numCore)) {
    return "";
  }

  const signed = neg ? -Math.abs(numCore) : numCore;

  return new Intl.NumberFormat(locale, {
    numberingSystem: "latn",
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFrac,
  }).format(signed);
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Convierte el texto mostrado en el campo a número (unidades monetarias locales). */
export function parseMaskedMoney(
  display: string,
  locale: string,
  currency: CurrencyCode,
): number {
  const { groupSep, decimalSep, maxFrac } = getMoneyMaskFormat(
    locale,
    currency,
  );

  let s = display.normalize("NFKC").trim();
  let neg = false;
  const first = s[0];
  if (first === "-" || first === "\u2212") {
    neg = true;
    s = s.slice(1).trim();
  }

  if (groupSep) {
    s = s.replace(new RegExp(escapeRe(groupSep), "g"), "");
  }
  s = s.replace(/\s/g, "");

  let intPart = "";
  let fracPart = "";
  if (maxFrac > 0 && decimalSep && s.includes(decimalSep)) {
    const ix = s.lastIndexOf(decimalSep);
    intPart = s.slice(0, ix).replace(/\D/g, "");
    fracPart = s.slice(ix + decimalSep.length).replace(/\D/g, "");
    if (fracPart.length > maxFrac) fracPart = fracPart.slice(0, maxFrac);
  } else {
    intPart = s.replace(/\D/g, "");
  }

  const intTrim = intPart.replace(/^0+(?=\d)/u, "");
  const intParsed =
    intTrim === "" && fracPart !== "" ? "0" : intTrim === "" ? "0" : intTrim;

  if (intParsed === "" && fracPart === "") return 0;

  const whole = intParsed === "" ? "0" : intParsed;
  const num =
    fracPart !== ""
      ? Number.parseFloat(`${whole}.${fracPart}`)
      : Number.parseInt(whole, 10);

  if (!Number.isFinite(num)) return 0;
  return neg ? -Math.abs(num) : num;
}

/** Reformatea el valor tras perder foco (quita decimal colgante, etc.). */
export function finalizeMoneyDisplay(
  display: string,
  locale: string,
  currency: CurrencyCode,
): string {
  const t = display.replace(/\u202f|\u00a0/g, " ").trim();
  if (t === "" || t === "-" || t === "\u2212") {
    return "";
  }
  return placeholderMoney(
    parseMaskedMoney(display, locale, currency),
    locale,
    currency,
  );
}

/** Texto estático tipo placeholder (solo visual). */
export function placeholderMoney(
  amount: number,
  locale: string,
  currency: CurrencyCode,
): string {
  if (!Number.isFinite(amount)) return "";
  const { maxFrac } = getMoneyMaskFormat(locale, currency);
  return new Intl.NumberFormat(locale, {
    numberingSystem: "latn",
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFrac,
  }).format(amount);
}
