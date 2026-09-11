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
        "border-b",
        dark ? "bg-foreground text-background" : "bg-muted/25 text-foreground",
      )}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
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
          <h1 className="mt-5 break-words text-4xl font-bold tracking-tight sm:text-6xl">
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
            className={cn(
              "flex flex-wrap gap-8 border-t pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0",
              dark ? "border-background/20" : "border-border",
            )}
          >
            {metrics.map((metric) => (
              <div key={metric.label}>
                <p className="text-3xl font-bold">{metric.value}</p>
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
