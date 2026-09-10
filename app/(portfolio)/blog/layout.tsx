import { BlogShell } from "@/components/blog/BlogShell";
import { getBlogSettings } from "@/lib/blog";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getBlogSettings();
  return <BlogShell settings={settings}>{children}</BlogShell>;
}
