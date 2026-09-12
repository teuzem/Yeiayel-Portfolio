import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BlogPageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  metrics?: Array<{ value: string | number; label: string }>;
  action?: ReactNode;
  dark?: boolean;
}

export function BlogPageHero({
  eyebrow,
  title,
  description,
  icon: Icon,
  metrics = [],
  action,
  dark = false,
}: BlogPageHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        dark
          ? "bg-foreground text-background"
          : "bg-[linear-gradient(135deg,var(--color-muted),transparent_58%)] text-foreground",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-24 -top-32 size-80 rounded-full border",
          dark ? "border-background/10" : "border-foreground/10",
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-16 size-52 rounded-full border",
          dark ? "border-background/10" : "border-foreground/10",
        )}
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-4xl">
          <p
            className={cn(
              "inline-flex items-center gap-2 text-sm font-semibold",
              dark ? "text-background/65" : "text-primary",
            )}
          >
            <Icon className="size-4" />
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl break-words text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p
            className={cn(
              "mt-6 max-w-2xl text-lg leading-8",
              dark ? "text-background/70" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
          {action ? <div className="mt-8">{action}</div> : null}
        </div>

        {metrics.length ? (
          <div
            className={cn("flex flex-wrap gap-3 lg:max-w-sm lg:justify-end")}
          >
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className={cn(
                  "min-w-28 rounded-lg px-5 py-4",
                  dark
                    ? "bg-background/10 ring-1 ring-background/10"
                    : "bg-background/80 shadow-sm ring-1 ring-foreground/5 backdrop-blur",
                )}
              >
                <p className="text-2xl font-bold">{metric.value}</p>
                <p
                  className={cn(
                    "mt-1 text-xs font-semibold uppercase tracking-[0.14em]",
                    dark ? "text-background/55" : "text-muted-foreground",
                  )}
                >
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
