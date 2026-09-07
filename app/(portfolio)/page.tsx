import { Suspense } from "react";
import PortfolioContent from "@/components/PortfolioContent";

export default async function Home() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={null}>
        <PortfolioContent />
      </Suspense>
    </main>
  );
}
