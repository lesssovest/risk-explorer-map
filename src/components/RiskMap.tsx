import {
  RISK_KINDS,
  formatCompact,
  treemap,
  type MetricId,
  type Risk,
  type RiskKindId,
} from "@/lib/risks";

type Cell = {
  id: RiskKindId;
  name: string;
  count: number;
  sum: number;
};

const TONES = [
  "bg-high text-high-foreground",
  "bg-info text-info-foreground",
  "bg-violet text-violet-foreground",
  "bg-warn text-warn-foreground",
] as const;

export function RiskMap({
  risks,
  metric,
  onSelectKind,
}: {
  risks: Risk[];
  metric: MetricId;
  onSelectKind: (kind: RiskKindId) => void;
}) {
  const cells: Cell[] = RISK_KINDS.map((kind) => {
    const items = risks.filter((r) => r.kind === kind.id);
    return {
      id: kind.id,
      name: kind.name,
      count: items.length,
      sum: items.reduce((acc, r) => acc + r[metric], 0),
    };
  });

  const max = Math.max(...cells.map((c) => c.sum), 1);
  // Minimum weight keeps empty / zero-sum kinds visible and readable.
  const weights = cells.map((c) => 0.35 + (c.sum / max) * 1.65);
  const rects = treemap(weights, 2.1);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-card p-2 ring-1 ring-border">
      <div className="relative h-[min(58vh,520px)] min-h-[420px] w-full">
        {cells.map((cell, i) => {
          const r = rects[i]!;
          const tone = TONES[i % TONES.length];
          const value = cell.count === 0 ? "—" : formatCompact(cell.sum);
          return (
            <button
              key={cell.id}
              onClick={() => onSelectKind(cell.id)}
              style={{
                left: `${r.x * 100}%`,
                top: `${r.y * 100}%`,
                width: `${r.w * 100}%`,
                height: `${r.h * 100}%`,
              }}
              className="absolute p-1 text-left"
            >
              <span
                className={`flex h-full w-full flex-col justify-between overflow-hidden rounded-xl px-3 py-2.5 ring-1 ring-inset ring-border/60 transition-transform duration-150 hover:-translate-y-0.5 hover:ring-primary ${tone}`}
              >
                <span className="truncate text-[0.8125rem] font-semibold leading-tight">
                  {cell.name}
                </span>
                <span className="truncate text-base font-bold leading-tight sm:text-lg">
                  {value}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
