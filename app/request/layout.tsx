import type { ReactNode } from "react";
import { AuthProvider } from "@/components/AuthProvider";

export default function RequestLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      {children}
    </AuthProvider>
  );
}
