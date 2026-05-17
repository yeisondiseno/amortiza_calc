"use client";

// React
import { forwardRef, type ComponentPropsWithoutRef } from "react";

// Libraries
import sanitizeHtml from "sanitize-html";

import styles from "./Input.module.css";

export type InputProps = ComponentPropsWithoutRef<"input">;

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [],
  allowedAttributes: {},
};

function cn(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, onChange, ...props },
  ref,
) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    e.target.value = sanitizeHtml(e.target.value, SANITIZE_OPTIONS);
    onChange(e);
  };

  return (
    <input
      ref={ref}
      className={cn(styles.field, className)}
      {...props}
      onChange={handleChange}
    />
  );
});

Input.displayName = "Input";
