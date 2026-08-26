import { LEVEL_LABEL, RISK_KINDS, formatMoney, type Risk } from "@/lib/risks";

export function RiskListCard({ risk }: { risk: Risk }) {
  const kind = RISK_KINDS.find((k) => k.id === risk.kind)?.name ?? "";

  return (
    <article className="rounded-2xl bg-card p-5 ring-1 ring-border transition-shadow hover:shadow-[0_8px_28px_-16px_oklch(0.24_0.02_260_/_0.25)]">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-high px-2.5 py-1 text-xs font-semibold text-high-foreground">
            {LEVEL_LABEL[risk.level]}
          </span>
          {risk.isNew && (
            <span className="rounded-full bg-info px-2.5 py-1 text-xs font-semibold text-info-foreground">
              Новый
            </span>
          )}
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            {risk.stage}
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
            {kind}
          </span>
        </div>
        <span className="text-xs font-semibold tracking-wide text-muted-foreground">
          {risk.code}
        </span>
      </header>

      <h3 className="mt-3 text-lg font-bold leading-snug">{risk.title}</h3>

      <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 md:grid-cols-4">
        <div>
          <dt className="text-xs text-muted-foreground">Факт потерь</dt>
          <dd className="mt-1 text-sm font-bold">{formatMoney(risk.fact)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Лимит</dt>
          <dd className="mt-1 text-sm font-bold">{formatMoney(risk.limit)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Прогноз</dt>
          <dd className="mt-1 text-sm font-bold">{formatMoney(risk.forecast)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Источник</dt>
          <dd className="mt-1 text-sm font-semibold text-muted-foreground">{risk.source}</dd>
        </div>
      </dl>
    </article>
  );
}
