"use client";

// React
import { forwardRef, type ComponentPropsWithoutRef } from "react";

// Libraries
import sanitizeHtml from "sanitize-html";

export type InputProps = ComponentPropsWithoutRef<"input">;

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [],
  allowedAttributes: {},
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { onChange, ...props },
  ref,
) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    e.target.value = sanitizeHtml(e.target.value, SANITIZE_OPTIONS);
    onChange(e);
  };

  return <input ref={ref} {...props} onChange={handleChange} />;
});

Input.displayName = "Input";
