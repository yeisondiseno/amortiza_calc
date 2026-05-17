// React
import type { CSSProperties } from "react";
// Styles
import styles from "./Logo.module.css";

type LogoVariant = "primary" | "stacked" | "symbol" | "wordmark";
type LogoTone = "default" | "mono" | "onDark";

type Props = Readonly<{
  variant?: LogoVariant;
  tone?: LogoTone;
  height?: number;
  ariaLabel?: string;
  className?: string;
}>;

const WORDMARK_TEXT = "LoanCalc";

const ROOT_CLASS: Record<LogoVariant, string> = {
  primary: styles.rootPrimary,
  stacked: styles.rootStacked,
  symbol: styles.rootSymbolOnly,
  wordmark: styles.rootWordmarkOnly,
};

const TONE_CLASS: Record<LogoTone, string> = {
  default: styles.toneDefault,
  mono: styles.toneMono,
  onDark: styles.toneOnDark,
};

const SymbolMark = () => (
  <svg
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.svg}
    aria-hidden
    focusable="false"
  >
    <rect className={styles.frame} width="32" height="32" rx="7" />
    <rect className={styles.bar} x="6" y="8" width="4" height="16" rx="1" />
    <rect className={styles.bar} x="14" y="13" width="4" height="11" rx="1" />
    <rect className={styles.bar} x="22" y="18" width="4" height="6" rx="1" />
    <rect className={styles.baseline} x="5" y="25" width="22" height="2" rx="1" />
  </svg>
);

export const Logo = ({
  variant = "primary",
  tone = "default",
  height = 32,
  ariaLabel = WORDMARK_TEXT,
  className,
}: Props) => {
  // Values
  const rootClassName = [
    styles.root,
    ROOT_CLASS[variant],
    TONE_CLASS[tone],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const showSymbol = variant !== "wordmark";
  const showWordmark = variant !== "symbol";

  return (
    <span
      className={rootClassName}
      role="img"
      aria-label={ariaLabel}
      style={{ "--logo-height": `${height}px` } as CSSProperties}
    >
      {showSymbol && <SymbolMark />}
      {showWordmark && (
        <span className={styles.wordmark} aria-hidden>
          {WORDMARK_TEXT}
        </span>
      )}
    </span>
  );
};
