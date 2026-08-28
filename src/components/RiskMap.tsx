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
  // Сортируем по убыванию суммы: вместе с row-reverse + wrap
  // наибольшая сумма оказывается справа сверху, наименьшая — слева снизу.
  const cells = allCells.filter((c) => c.hasData).sort((a, b) => b.sum - a.sum);
  const max = Math.max(...cells.map((c) => c.sum), 1);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-card p-2 ring-1 ring-border">
      {/* Flex-раскладка: плитки переносятся на новые строки при изменении
          масштаба/ширины и никогда не налезают друг на друга.
          row-reverse (первая плитка — справа): наибольшая сумма — справа
          сверху, наименьшая — слева снизу. */}
      <div className="flex h-[min(64vh,600px)] min-h-[480px] w-full flex-row-reverse flex-wrap content-stretch gap-1 overflow-y-auto">
        {cells.length === 0 && (
          <div className="flex w-full items-center justify-center text-sm text-muted-foreground">
            Нет данных по выбранному показателю и типу рисков
          </div>
        )}
        {cells.map((cell) => {
          const tone = toneFor(cell.sum, max);
          const value = formatCompact(cell.sum);
          // Вес плитки: минимум гарантирует читаемый размер,
          // рост пропорционален сумме показателя.
          const weight = 0.6 + (cell.sum / max) * 1.4;
          return (
            <button
              key={cell.id}
              onClick={() => onSelectKind(cell.id)}
              style={{
                flexGrow: weight,
                flexBasis: `${Math.max(14, weight * 10)}%`,
              }}
              className="min-h-[96px] min-w-[132px] p-0.5 text-left"
            >
              <span
                className={`flex h-full w-full flex-col gap-3 justify-between overflow-hidden rounded-xl px-3 py-2.5 ring-1 ring-inset ring-border/60 transition-transform duration-150 hover:-translate-y-0.5 hover:ring-primary ${tone}`}
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="break-words text-[0.8125rem] font-semibold leading-snug">
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
