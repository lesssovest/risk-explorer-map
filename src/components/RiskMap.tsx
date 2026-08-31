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

// Базовый минимальный «вес» стороны квадрата — чтобы даже самые малые
// суммы давали плитку, в которую помещаются название и цифра.
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
  const cells = allCells
    .filter((c) => c.hasData)
    .sort((a, b) => b.sum - a.sum);

  const max = Math.max(...cells.map((c) => c.sum), 1);

  // Сторона квадрата ~ sqrt(суммы): площадь пропорциональна показателю.
  const sides = cells.map(
    (c) => MIN_SIDE + Math.sqrt(c.sum / max) * (MAX_SIDE - MIN_SIDE),
  );

  // Раскладка в ряды («полки»): каждый ряд растягивается flex'ом ровно на
  // всю ширину карты, поэтому все элементы вместе образуют единый
  // прямоугольник без наложений. Число рядов подбираем так, чтобы общая
  // форма была близка к прямоугольнику ~4:3.
  const n = cells.length;
  const rowCount = Math.max(1, Math.round(Math.sqrt(n * 0.75)));
  const totalSide = sides.reduce((a, b) => a + b, 0);
  const targetRow = totalSide / rowCount;

  const rows: { cells: Cell[]; sides: number[] }[] = [];
  {
    let cur: Cell[] = [];
    let curSides: number[] = [];
    let curSum = 0;
    for (let i = 0; i < n; i++) {
      if (
        cur.length > 0 &&
        curSum + sides[i]! > targetRow &&
        rows.length < rowCount - 1
      ) {
        rows.push({ cells: cur, sides: curSides });
        cur = [];
        curSides = [];
        curSum = 0;
      }
      cur.push(cells[i]!);
      curSides.push(sides[i]!);
      curSum += sides[i]!;
    }
    if (cur.length > 0) rows.push({ cells: cur, sides: curSides });
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-card p-2 ring-1 ring-border">
      {cells.length === 0 ? (
        <div className="flex min-h-[320px] items-center justify-center text-sm text-muted-foreground">
          Нет данных по выбранному показателю и типу рисков
        </div>
      ) : (
        <div className="flex w-full flex-col gap-1.5">
          {rows.map((row, ri) => {
            const rowTotal = row.sides.reduce((a, b) => a + b, 0);
            return (
              // flex-row-reverse: крупнейший элемент ряда — справа,
              // ряды идут по убыванию, значит максимум — в правом верхнем
              // углу, минимум — в левом нижнем.
              <div key={ri} className="flex w-full flex-row-reverse items-start gap-1.5">
                {row.cells.map((cell, ci) => {
                  const tone = toneFor(cell.sum, max);
                  const value = formatCompact(cell.sum);
                  // Доля ряда = вес стороны; flex растянет ряд на 100%
                  // ширины, aspect-square сохранит квадратность.
                  const grow = row.sides[ci]! / rowTotal;
                  const small = row.sides[ci]! < MIN_SIDE + 40;
                  return (
                    <button
                      key={cell.id}
                      onClick={() => onSelectKind(cell.id)}
                      style={{ flexGrow: grow, flexBasis: 0 }}
                      className="aspect-square min-w-0 text-left"
                    >
                      <span
                        className={`flex h-full w-full flex-col overflow-hidden rounded-xl px-2.5 py-2 ring-1 ring-inset ring-border/60 transition-transform duration-150 hover:-translate-y-0.5 hover:ring-primary ${tone}`}
                      >
                        <span className="flex items-start justify-between gap-1.5">
                          <span
                            className={`min-w-0 break-words font-semibold leading-snug ${
                              small ? "text-[0.72rem]" : "text-[0.8125rem]"
                            }`}
                          >
                            {cell.name}
                          </span>
                          <span className="shrink-0 text-[0.6875rem] font-semibold tabular-nums opacity-55">
                            {cell.count}
                          </span>
                        </span>
                        <span
                          className={`mt-auto truncate pt-1 font-bold leading-tight tabular-nums ${
                            small ? "text-sm" : "text-base sm:text-lg"
                          }`}
                        >
                          {value}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
