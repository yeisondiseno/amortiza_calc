"use client";

// Libraries
import sanitizeHtml from "sanitize-html";
import { ComponentPropsWithoutRef } from "react";

type InputProps = ComponentPropsWithoutRef<"input">;

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [],
  allowedAttributes: {},
};

export const Input = ({ onChange, ...props }: InputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    e.target.value = sanitizeHtml(e.target.value, SANITIZE_OPTIONS);
    onChange(e);
  };

  return <input onChange={handleChange} {...props} />;
};
