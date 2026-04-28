export const ProblemSolution = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-card border border-border p-8 sm:p-10 shadow-soft">
            <span className="inline-block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">The problem</span>
            <h3 className="font-display text-3xl sm:text-4xl font-medium text-foreground leading-tight mb-4">
              Cold applications are broken.
            </h3>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Most people are not ignored because they lack potential. They are ignored because nobody knows their story.
            </p>
          </div>
          <div className="rounded-3xl bg-primary text-primary-foreground p-8 sm:p-10 shadow-warm relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-clay/30 blur-3xl" />
            <div className="relative">
              <span className="inline-block text-xs font-medium uppercase tracking-widest text-primary-foreground/70 mb-4">The Hayy way</span>
              <h3 className="font-display text-3xl sm:text-4xl font-medium leading-tight mb-4">
                Hayy makes access human again.
              </h3>
              <p className="text-base sm:text-lg text-primary-foreground/85 leading-relaxed">
                Join live rooms, meet professionals inside your target companies, ask real questions, and request warm career conversations or referrals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
