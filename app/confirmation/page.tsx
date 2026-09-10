import Link from "next/link";
import { ServiceConfirmationStatus } from "@/components/ServiceConfirmationStatus";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";

export default async function ConfirmationPage(props: {
  searchParams: Promise<{
    order?: string;
    status?: string;
    locale?: string;
    quote?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const isFr = searchParams.locale === "fr";
  const locale: Locale = isFr ? "fr" : "en";
  const dict = getDictionary(locale);
  const status = searchParams.status || "pending";
  const order = searchParams.order || "";
  const quote = searchParams.quote === "1";
  const initialStatus =
    status === "success"
      ? "paid"
      : status === "failed"
        ? "payment-failed"
        : quote
          ? "quote-requested"
          : "payment-pending";

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-xl w-full bg-card border rounded-2xl p-8 md:p-12 text-center">
        <ServiceConfirmationStatus
          orderId={order}
          initialStatus={initialStatus}
          quote={quote}
          messages={{
            success: dict.confirmation.success,
            failed: dict.confirmation.failed,
            pending: dict.confirmation.pending,
            quote: dict.confirmation.quote,
          }}
        />
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {dict.confirmation.title}
        </h1>
        <p className="text-xl text-muted-foreground mb-4">
          {dict.confirmation.subtitle}
        </p>

        {order && (
          <div className="p-3 rounded-lg bg-muted mb-4 text-sm">
            <span className="text-muted-foreground">
              {dict.confirmation.order}:
            </span>{" "}
            <span className="font-mono font-semibold">{order}</span>
          </div>
        )}

        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-8 text-left">
          <p className="font-semibold mb-1">{dict.confirmation.whatNow}</p>
          <p className="text-sm text-muted-foreground">
            {dict.confirmation.steps}
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
        >
          {dict.confirmation.backHome}
        </Link>
      </div>
    </div>
  );
}
