"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { value: "light", icon: Sun, labelKey: "light" },
  { value: "dark", icon: Moon, labelKey: "dark" },
  { value: "system", icon: Monitor, labelKey: "system" },
] as const;

export function ModeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const { dict } = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <fieldset
      className={cn(
        "flex h-11 items-center gap-1 rounded-lg border border-border/70 bg-background/90 p-1 shadow-lg backdrop-blur-xl",
        className,
      )}
    >
      <legend className="sr-only">{dict.theme.toggle}</legend>
      {THEME_OPTIONS.map(({ value, icon: Icon, labelKey }) => {
        const active = mounted && theme === value;
        const label = dict.theme[labelKey];
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
              active
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            aria-pressed={active}
            aria-label={label}
            title={label}
            suppressHydrationWarning
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </button>
        );
      })}
    </fieldset>
  );
}
