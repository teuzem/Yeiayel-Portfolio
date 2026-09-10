export default function BlogPostLoading() {
  return (
    <main className="container mx-auto max-w-3xl animate-pulse px-6 py-16">
      <div className="h-4 w-32 rounded bg-muted" />
      <div className="mt-8 h-12 w-4/5 rounded bg-muted" />
      <div className="mt-4 h-6 w-3/5 rounded bg-muted" />
      <div className="mt-10 aspect-[16/9] rounded-lg bg-muted" />
      <div className="mt-10 space-y-4">
        <div className="h-5 rounded bg-muted" />
        <div className="h-5 rounded bg-muted" />
        <div className="h-5 w-4/5 rounded bg-muted" />
      </div>
    </main>
  );
}
