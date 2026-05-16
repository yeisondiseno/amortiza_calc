"use client";

// React
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// Constants
const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

const SAME_SITE_HEADER: Record<"strict" | "lax", "Strict" | "Lax"> = {
  strict: "Strict",
  lax: "Lax",
};

// Types (module-local)
export type UsePersistorCookieOptions = {
  maxAgeSeconds?: number;
  path?: string;
  sameSite?: "strict" | "lax";
  /**
   * Flag `Secure`. Si se omite, solo se activa en `https:` para que el desarrollo en HTTP siga funcionando.
   * Nota: las cookies `HttpOnly` no pueden crearse desde JavaScript del cliente.
   */
  secure?: boolean;
};

export type UsePersistorOptions = UsePersistorCookieOptions & {
  /**
   * Si es `true` (por defecto), lee la cookie al montar y actualiza `valueFromStorage`.
   * Usa `false` en una segunda instancia del hook que solo debe escribir (p. ej. tras hidratar el formulario en otro componente).
   */
  readOnMount?: boolean;
  /**
   * Si es `true` (por defecto), serializa `valueToPersist` y escribe la cookie cuando cambia.
   * Usa `false` cuando solo necesites la lectura inicial (p. ej. shell que aún no tiene el estado vivo a guardar).
   */
  persistOnChange?: boolean;
};

export type UsePersistorResult<T> = {
  /** Valor leído de la cookie al hidratar (o `fallback` si no hay dato válido). */
  valueFromStorage: T;
  clear: () => void;
  /** `false` hasta completar la lectura de la cookie cuando `readOnMount` es `true`; si `readOnMount` es `false`, es `true` de inmediato. */
  isHydrated: boolean;
};

type ResolvedCookieFlags = {
  path: string;
  maxAgeSeconds: number;
  sameSite: "Strict" | "Lax";
  secure: boolean;
};

const cookieFlagSecure = (options: UsePersistorCookieOptions): boolean => {
  if (options.secure !== undefined) {
    return options.secure;
  }
  return (
    typeof window !== "undefined" && window.location.protocol === "https:"
  );
};

const resolveFlags = (
  options: UsePersistorCookieOptions,
): ResolvedCookieFlags => {
  const sameSiteKey = options.sameSite ?? "strict";
  return {
    path: options.path ?? "/",
    maxAgeSeconds: options.maxAgeSeconds ?? DEFAULT_MAX_AGE_SECONDS,
    sameSite: SAME_SITE_HEADER[sameSiteKey],
    secure: cookieFlagSecure(options),
  };
};

const readBrowserCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const key = encodeURIComponent(name);
  const entries = document.cookie.split("; ");
  for (const entry of entries) {
    if (entry.startsWith(`${key}=`)) {
      return decodeURIComponent(entry.slice(key.length + 1));
    }
  }
  return null;
};

const writeBrowserCookie = (
  name: string,
  value: string,
  flags: ResolvedCookieFlags,
): void => {
  if (typeof document === "undefined") return;
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  cookie += `; Path=${flags.path}`;
  cookie += `; Max-Age=${flags.maxAgeSeconds}`;
  cookie += `; SameSite=${flags.sameSite}`;
  if (flags.secure) cookie += "; Secure";
  document.cookie = cookie;
};

const deleteBrowserCookie = (
  name: string,
  flags: ResolvedCookieFlags,
): void => {
  if (typeof document === "undefined") return;
  let cookie = `${encodeURIComponent(name)}=`;
  cookie += `; Path=${flags.path}`;
  cookie += "; Max-Age=0";
  cookie += `; SameSite=${flags.sameSite}`;
  if (flags.secure) cookie += "; Secure";
  document.cookie = cookie;
};

/**
 * Lee y/o escribe un valor serializable en cookie (`Path`, `Max-Age`, `SameSite`, `Secure`).
 * Pasa el valor actual como `valueToPersist` para que se guarde en cada cambio (con `persistOnChange: true`).
 */
export const usePersistor = <T,>(
  cookieName: string,
  fallback: T,
  valueToPersist: T,
  options: UsePersistorOptions = {},
): UsePersistorResult<T> => {
  // Params
  const {
    maxAgeSeconds,
    path,
    sameSite,
    secure,
    readOnMount = true,
    persistOnChange = true,
  } = options;

  // State
  const [valueFromStorage, setValueFromStorage] = useState<T>(fallback);
  const [isHydrated, setIsHydrated] = useState(() => !readOnMount);

  // Hooks
  const flags = useMemo(
    () =>
      resolveFlags({
        maxAgeSeconds,
        path,
        sameSite,
        secure,
      }),
    [maxAgeSeconds, path, sameSite, secure],
  );

  const lastWrittenJsonRef = useRef<string | null>(null);

  // Actions
  const clear = useCallback(() => {
    deleteBrowserCookie(cookieName, flags);
    setValueFromStorage(fallback);
    lastWrittenJsonRef.current = JSON.stringify(fallback);
  }, [cookieName, fallback, flags]);

  useEffect(() => {
    if (!readOnMount) return;
    startTransition(() => {
      const raw = readBrowserCookie(cookieName);
      let next: T = fallback;
      if (raw) {
        try {
          next = JSON.parse(raw) as T;
        } catch {
          deleteBrowserCookie(cookieName, flags);
        }
      }
      setValueFromStorage(next);
      lastWrittenJsonRef.current = JSON.stringify(next);
      setIsHydrated(true);
    });
  }, [cookieName, fallback, flags, readOnMount]);

  useEffect(() => {
    if (!isHydrated || !persistOnChange) return;
    const json = JSON.stringify(valueToPersist);
    if (lastWrittenJsonRef.current === json) return;
    lastWrittenJsonRef.current = json;
    writeBrowserCookie(cookieName, json, flags);
  }, [cookieName, flags, isHydrated, persistOnChange, valueToPersist]);

  return { valueFromStorage, clear, isHydrated };
};
