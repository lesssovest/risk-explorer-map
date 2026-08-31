import {
  RISK_KINDS,
  formatCompact,
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

// Минимальная сторона квадрата — достаточна для названия вида риска и цифры.
const MIN_SIDE = 128;
const MAX_SIDE = 260;

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

  // Виды рисков без данных на карте не отображаются.
  // Квадраты: площадь пропорциональна сумме, поэтому сторона ~ sqrt(суммы).
  // Сортировка по убыванию + flex-row-reverse: крупнейший вид — в правом
  // верхнем углу, наименьший — в левом нижнем. Наложений нет, т.к. плитки
  // идут в потоке (flex-wrap), а не позиционируются абсолютно.
  const cells = allCells
    .filter((c) => c.hasData)
    .sort((a, b) => b.sum - a.sum);

  const max = Math.max(...cells.map((c) => c.sum), 1);

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-card p-3 ring-1 ring-border">
      {cells.length === 0 ? (
        <div className="flex min-h-[320px] items-center justify-center text-sm text-muted-foreground">
          Нет данных по выбранному показателю и типу рисков
        </div>
      ) : (
        <div className="flex flex-row-reverse flex-wrap content-start items-end justify-start gap-2">
          {cells.map((cell) => {
            const tone = toneFor(cell.sum, max);
            const value = formatCompact(cell.sum);
            const side = Math.round(
              MIN_SIDE + Math.sqrt(cell.sum / max) * (MAX_SIDE - MIN_SIDE),
            );
            const isSmall = side < MIN_SIDE + 40;
            return (
              <button
                key={cell.id}
                onClick={() => onSelectKind(cell.id)}
                style={{ width: side, height: side }}
                className="shrink-0 text-left"
              >
                <span
                  className={`flex h-full w-full flex-col overflow-hidden rounded-xl px-3 py-2.5 ring-1 ring-inset ring-border/60 transition-transform duration-150 hover:-translate-y-0.5 hover:ring-primary ${tone}`}
                >
                  <span className="flex items-start justify-between gap-1.5">
                    <span
                      className={`min-w-0 break-words font-semibold leading-snug ${
                        isSmall ? "text-[0.75rem]" : "text-[0.8125rem]"
                      }`}
                    >
                      {cell.name}
                    </span>
                    <span className="shrink-0 text-[0.6875rem] font-semibold tabular-nums opacity-55">
                      {cell.count}
                    </span>
                  </span>
                  <span className="mt-auto truncate pt-1.5 text-base font-bold leading-tight tabular-nums sm:text-lg">
                    {value}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
