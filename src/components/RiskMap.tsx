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
  hasData: boolean;
};

const TONE_HIGH = "bg-high text-high-foreground";
const TONE_MID = "bg-warn text-warn-foreground";
const TONE_LOW = "bg-ok text-ok-foreground";

function toneFor(sum: number, max: number): string {
  if (max <= 0) return TONE_LOW;
  const ratio = sum / max;
  if (ratio > 2 / 3) return TONE_HIGH;
  if (ratio > 1 / 3) return TONE_MID;
  return TONE_LOW;
}

export function RiskMap({
  risks,
  metric,
  onSelectKind,
}: {
  risks: Risk[];
  metric: MetricId;
  onSelectKind: (kind: RiskKindId) => void;
}) {
  const allCells: Cell[] = RISK_KINDS.map((kind) => {
    const items = risks.filter((r) => r.kind === kind.id && r[metric] !== null);
    const total = risks.filter((r) => r.kind === kind.id).length;
    return {
      id: kind.id,
      name: kind.name,
      count: total,
      sum: items.reduce((acc, r) => acc + (r[metric] ?? 0), 0),
      hasData: items.length > 0,
    };
  });

  // Виды рисков без данных (нет ни одного риска с установленным показателем)
  // на карте не отображаются — вместо прочерка просто скрываем их.
  const cells = allCells.filter((c) => c.hasData);

  // Минимальный вес повышен, чтобы даже у самых маленьких сумм
  // плитка была достаточно большой для полного названия вида риска.
  const max = Math.max(...cells.map((c) => c.sum), 1);
  const weights = cells.map((c) => 0.6 + (c.sum / max) * 1.4);
  const rects = treemap(weights, 2.1);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-card p-2 ring-1 ring-border">
      <div className="relative h-[min(58vh,520px)] min-h-[420px] w-full">
        {cells.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            Нет данных по выбранному показателю и типу рисков
          </div>
        )}
        {cells.map((cell, i) => {
          const r = rects[i]!;
          const tone = toneFor(cell.sum, max);
          const value = formatCompact(cell.sum);
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
                <span className="flex items-start justify-between gap-2">
                  <span className="truncate text-[0.8125rem] font-semibold leading-tight">
                    {cell.name}
                  </span>
                  <span className="shrink-0 text-[0.6875rem] font-semibold tabular-nums opacity-55">
                    {cell.count}
                  </span>
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
