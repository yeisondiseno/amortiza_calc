"use client";

// React
import { forwardRef, type ComponentPropsWithoutRef } from "react";

export type SelectProps = ComponentPropsWithoutRef<"select">;

/** Native `<select>` con `forwardRef` para usar con react-hook-form (`register`, `Controller`). */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(props, ref) {
    return <select ref={ref} {...props} />;
  },
);

Select.displayName = "Select";
