export default function BlogLoading() {
  return (
    <main className="animate-pulse">
      <section className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="h-5 w-32 rounded bg-muted" />
          <div className="mt-6 h-14 max-w-3xl rounded bg-muted" />
          <div className="mt-5 h-6 max-w-2xl rounded bg-muted" />
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-14 sm:grid-cols-2 lg:grid-cols-3">
        {["one", "two", "three", "four", "five", "six"].map((key) => (
          <div
            key={key}
            className="aspect-[4/3] rounded-lg bg-muted ring-1 ring-foreground/5"
          />
        ))}
      </section>
    </main>
  );
}
