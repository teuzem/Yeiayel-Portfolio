import {
  BadgeCheck,
  BrainCircuit,
  Building2,
  ChartNoAxesCombined,
  CloudCog,
  CodeXml,
  Database,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  "badge-check": BadgeCheck,
  "brain-circuit": BrainCircuit,
  "building-2": Building2,
  chart: ChartNoAxesCombined,
  "cloud-cog": CloudCog,
  code: CodeXml,
  database: Database,
  "graduation-cap": GraduationCap,
};

const slugIcons: Record<string, LucideIcon> = {
  "artificial-intelligence": BrainCircuit,
  "batir-le-pays": Building2,
  "career-education": GraduationCap,
  "cloud-security": CloudCog,
  "data-analysis": ChartNoAxesCombined,
  "data-science": Database,
  "product-reviews": BadgeCheck,
  "software-engineering": CodeXml,
};

export function CategoryIcon({
  icon,
  slug,
  className = "size-7",
}: {
  icon?: string | null;
  slug?: string | null;
  className?: string;
}) {
  const Icon = icons[icon || ""] || slugIcons[slug || ""] || Database;
  return <Icon className={className} aria-hidden="true" strokeWidth={1.8} />;
}
