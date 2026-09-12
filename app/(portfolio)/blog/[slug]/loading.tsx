export default function BlogPostLoading() {
  return (
    <main className="container mx-auto max-w-7xl animate-pulse px-6 py-14">
      <div className="h-4 w-32 rounded bg-muted" />
      <div className="mt-8 h-14 max-w-4xl rounded bg-muted" />
      <div className="mt-4 h-7 max-w-2xl rounded bg-muted" />
      <div className="mt-10 aspect-[16/9] rounded-lg bg-muted" />
      <div className="mt-12 grid gap-12 lg:grid-cols-[290px_minmax(0,760px)] lg:justify-between">
        <div className="hidden space-y-4 lg:block">
          <div className="h-40 rounded-lg bg-muted" />
          <div className="h-64 rounded-lg bg-muted" />
        </div>
        <div className="space-y-4">
          <div className="h-5 rounded bg-muted" />
          <div className="h-5 rounded bg-muted" />
          <div className="h-5 w-4/5 rounded bg-muted" />
          <div className="mt-8 h-9 w-3/5 rounded bg-muted" />
          <div className="h-5 rounded bg-muted" />
        </div>
      </div>
    </main>
  );
}
