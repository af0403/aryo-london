"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
const Context = createContext<{
  saved: string[];
  toggle: (slug: string) => void;
}>({ saved: [], toggle: () => {} });
export function StorefrontProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<string[]>([]);
  useEffect(() => {
    try {
      const value: unknown = JSON.parse(
        localStorage.getItem("aryo-saved") ?? "[]",
      );
      if (Array.isArray(value))
        setSaved(value.filter((x): x is string => typeof x === "string"));
    } catch {}
    const sync = (e: StorageEvent) => {
      if (e.key === "aryo-saved") {
        try {
          const value: unknown = JSON.parse(e.newValue ?? "[]");
          if (Array.isArray(value))
            setSaved(value.filter((x): x is string => typeof x === "string"));
        } catch {}
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const toggle = useCallback(
    (slug: string) =>
      setSaved((current) => {
        const next = current.includes(slug)
          ? current.filter((x) => x !== slug)
          : [...current, slug];
        try {
          localStorage.setItem("aryo-saved", JSON.stringify(next));
        } catch {}
        return next;
      }),
    [],
  );
  return (
    <Context.Provider value={{ saved, toggle }}>{children}</Context.Provider>
  );
}
export const useSaved = () => useContext(Context);
