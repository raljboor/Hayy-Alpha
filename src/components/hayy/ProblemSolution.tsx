export const ProblemSolution = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-6">

          {/* Problem card */}
          <div
            className="rounded-3xl p-8 sm:p-10 shadow-soft"
            style={{
              background: "var(--paper)",
              border: "1px solid var(--line)",
            }}
          >
            <span
              className="inline-block text-xs font-medium uppercase tracking-widest mb-4"
              style={{ color: "var(--ink-mute)" }}
            >
              The problem
            </span>
            <h3
              className="font-display text-3xl sm:text-4xl font-medium leading-tight mb-4"
              style={{ color: "var(--ink)" }}
            >
              Cold applications are broken.
            </h3>
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: "var(--ink-soft)" }}
            >
              Most people are not ignored because they lack potential. They are
              ignored because nobody knows their story.
            </p>
          </div>

          {/* Solution card */}
          <div
            className="rounded-3xl p-8 sm:p-10 shadow-warm relative overflow-hidden"
            style={{
              background: "var(--clay)",
              color: "var(--paper)",
            }}
          >
            <div
              className="absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl"
              style={{ background: "rgba(255,255,255,.12)" }}
            />
            <div className="relative">
              <span
                className="inline-block text-xs font-medium uppercase tracking-widest mb-4"
                style={{ color: "var(--paper)", opacity: 0.7 }}
              >
                The Hayy way
              </span>
              <h3
                className="font-display text-3xl sm:text-4xl font-medium leading-tight mb-4"
                style={{ color: "var(--paper)" }}
              >
                Hayy makes access human again.
              </h3>
              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: "var(--paper)", opacity: 0.85 }}
              >
                Join live rooms, meet professionals inside your target companies,
                ask real questions, and request warm career conversations or
                referrals.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
