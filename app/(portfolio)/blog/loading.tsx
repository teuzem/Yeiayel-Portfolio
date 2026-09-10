export default function BlogLoading() {
  return (
    <main className="mx-auto max-w-7xl animate-pulse px-6 py-16">
      <div className="h-5 w-28 rounded bg-muted" />
      <div className="mt-5 h-14 max-w-3xl rounded bg-muted" />
      <div className="mt-5 h-6 max-w-2xl rounded bg-muted" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {["one", "two", "three", "four", "five", "six"].map((key) => (
          <div key={key} className="aspect-[4/3] rounded-lg bg-muted" />
        ))}
      </div>
    </main>
  );
}
