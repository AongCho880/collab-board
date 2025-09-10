export default function Home() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold">Welcome to CollabBoard</h1>
      <p className="text-gray-700 max-w-2xl">
        Your minimal, no‑frills Kanban to practice industry‑style development: branching,
        pull requests, code quality, and CI from day one.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="font-semibold mb-2">What is in Phase 1?</h2>
          <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
            <li>Clean Next.js & Tailwind scaffold</li>
            <li>Git workflow (main / development)</li>
            <li>Conventional Commits + Husky</li>
            <li>CI: lint • typecheck • build</li>
          </ul>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="font-semibold mb-2">Next steps</h2>
          <p className="text-sm text-gray-700">
            Create your first issue, branch from <code>development</code>, and open a PR. Let CI be
            your safety net.
          </p>
        </div>
      </div>
    </section>
  );
}