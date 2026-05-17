"use client";

// React
import { forwardRef, type ComponentPropsWithoutRef } from "react";

import styles from "./Select.module.css";

export type SelectProps = ComponentPropsWithoutRef<"select"> & {
  /** Contenedor externo (.shell): ancho/layout en TopBar vs formulario full width. */
  shellClassName?: string;
};

function cn(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

/** `<select>` nativo con mismo shell y campo que `<Input>` (forwardRef para react-hook-form). */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, shellClassName, children, ...props }, ref) {
    return (
      <div className={cn(styles.shell, shellClassName)}>
        <select
          ref={ref}
          className={cn(styles.field, className)}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  },
);

Select.displayName = "Select";
