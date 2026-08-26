export type RiskStatus = "active" | "analysis" | "archive";

export type RiskKindId =
  | "reputational"
  | "political"
  | "operational"
  | "financial"
  | "legal"
  | "technological"
  | "personnel"
  | "information"
  | "strategic"
  | "ecological";

export const RISK_KINDS: { id: RiskKindId; name: string }[] = [
  { id: "reputational", name: "Репутационные" },
  { id: "political", name: "Политические" },
  { id: "operational", name: "Операционные" },
  { id: "financial", name: "Финансовые" },
  { id: "legal", name: "Юридические" },
  { id: "technological", name: "Технологические" },
  { id: "personnel", name: "Кадровые" },
  { id: "information", name: "Информационные" },
  { id: "strategic", name: "Стратегические" },
  { id: "ecological", name: "Экологические" },
];

export type RiskLevel = "high" | "medium" | "low";

export type Risk = {
  code: string;
  title: string;
  kind: RiskKindId;
  status: RiskStatus;
  level: RiskLevel;
  isNew?: boolean;
  stage: string;
  fact: number;
  limit: number;
  forecast: number;
  strategy: string;
  source: string;
};

export const METRICS = [
  { id: "fact", label: "Факт потерь" },
  { id: "limit", label: "Лимит" },
  { id: "forecast", label: "Прогноз" },
] as const;

export type MetricId = (typeof METRICS)[number]["id"];

export const STATUS_TABS: { id: RiskStatus; label: string }[] = [
  { id: "active", label: "Активные риски" },
  { id: "analysis", label: "Анализ рисков" },
  { id: "archive", label: "Архив" },
];

export const LEVEL_LABEL: Record<RiskLevel, string> = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
};

export const RISKS: Risk[] = [
  {
    code: "TEST-RSK-1021",
    title: "Снижение качества услуг из-за расширения штата исполнителя",
    kind: "operational",
    status: "active",
    level: "high",
    stage: "На рассмотрении",
    fact: 0,
    limit: 1_200_000,
    forecast: 850_000,
    strategy: "Снижение",
    source: "АС Сенат",
  },
  {
    code: "TEST-RSK-1020",
    title: "Искажение метрики качества из-за формулы расчёта",
    kind: "operational",
    status: "active",
    level: "high",
    isNew: true,
    stage: "На рассмотрении",
    fact: 340_000,
    limit: 900_000,
    forecast: 610_000,
    strategy: "Снижение",
    source: "АС Сенат",
  },
  {
    code: "TEST-RSK-1019",
    title: "Безакцептное списание денежных средств",
    kind: "financial",
    status: "active",
    level: "high",
    isNew: true,
    stage: "На рассмотрении",
    fact: 4_800_000,
    limit: 9_500_000,
    forecast: 7_200_000,
    strategy: "Снижение",
    source: "АС Сенат",
  },
  {
    code: "TEST-RSK-1018",
    title: "Отток клиентов после публикаций в СМИ",
    kind: "reputational",
    status: "active",
    level: "medium",
    isNew: true,
    stage: "На рассмотрении",
    fact: 2_100_000,
    limit: 3_400_000,
    forecast: 2_900_000,
    strategy: "Уклонение",
    source: "АС Сенат",
  },
  {
    code: "TEST-RSK-1017",
    title: "Изменение регуляторных требований в отрасли",
    kind: "political",
    status: "active",
    level: "medium",
    stage: "В работе",
    fact: 0,
    limit: 0,
    forecast: 1_150_000,
    strategy: "Принятие",
    source: "Реестр НПА",
  },
  {
    code: "TEST-RSK-1016",
    title: "Нарушение сроков поставки оборудования",
    kind: "technological",
    status: "active",
    level: "medium",
    stage: "В работе",
    fact: 780_000,
    limit: 2_000_000,
    forecast: 1_400_000,
    strategy: "Снижение",
    source: "АС Сенат",
  },
  {
    code: "TEST-RSK-1015",
    title: "Утечка персональных данных сотрудников",
    kind: "information",
    status: "active",
    level: "high",
    stage: "На рассмотрении",
    fact: 1_600_000,
    limit: 5_000_000,
    forecast: 3_300_000,
    strategy: "Снижение",
    source: "SOC",
  },
  {
    code: "TEST-RSK-1014",
    title: "Дефицит квалифицированных специалистов",
    kind: "personnel",
    status: "analysis",
    level: "medium",
    stage: "Оценка",
    fact: 0,
    limit: 1_800_000,
    forecast: 2_400_000,
    strategy: "Снижение",
    source: "HR-портал",
  },
  {
    code: "TEST-RSK-1013",
    title: "Судебные претензии контрагента по договору подряда",
    kind: "legal",
    status: "analysis",
    level: "high",
    stage: "Оценка",
    fact: 3_250_000,
    limit: 6_000_000,
    forecast: 4_100_000,
    strategy: "Передача",
    source: "Юр. департамент",
  },
  {
    code: "TEST-RSK-1012",
    title: "Ошибка в стратегическом планировании выручки",
    kind: "strategic",
    status: "analysis",
    level: "low",
    stage: "Оценка",
    fact: 0,
    limit: 0,
    forecast: 0,
    strategy: "Принятие",
    source: "Планирование",
  },
  {
    code: "TEST-RSK-1011",
    title: "Публичный конфликт с партнёром",
    kind: "reputational",
    status: "analysis",
    level: "medium",
    stage: "Оценка",
    fact: 420_000,
    limit: 1_000_000,
    forecast: 700_000,
    strategy: "Снижение",
    source: "Медиамониторинг",
  },
  {
    code: "TEST-RSK-1010",
    title: "Сбой платёжного шлюза",
    kind: "technological",
    status: "archive",
    level: "high",
    stage: "Закрыт",
    fact: 5_600_000,
    limit: 5_000_000,
    forecast: 5_600_000,
    strategy: "Снижение",
    source: "АС Сенат",
  },
  {
    code: "TEST-RSK-1009",
    title: "Превышение лимита операционных потерь филиала",
    kind: "financial",
    status: "archive",
    level: "medium",
    stage: "Закрыт",
    fact: 1_950_000,
    limit: 2_500_000,
    forecast: 1_950_000,
    strategy: "Снижение",
    source: "АС Сенат",
  },
  {
    code: "TEST-RSK-1008",
    title: "Штраф за нарушение экологических нормативов",
    kind: "ecological",
    status: "archive",
    level: "low",
    stage: "Закрыт",
    fact: 300_000,
    limit: 300_000,
    forecast: 300_000,
    strategy: "Принятие",
    source: "Росприроднадзор",
  },
  {
    code: "TEST-RSK-1007",
    title: "Санкционные ограничения на поставщиков",
    kind: "political",
    status: "archive",
    level: "high",
    stage: "Закрыт",
    fact: 8_400_000,
    limit: 7_000_000,
    forecast: 8_400_000,
    strategy: "Уклонение",
    source: "Реестр НПА",
  },
];

export function formatMoney(value: number) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

export function formatCompact(value: number) {
  if (value === 0) return "0 ₽";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(".0", "")} млн ₽`;
  if (value >= 1_000) return `${Math.round(value / 1_000)} тыс ₽`;
  return `${value} ₽`;
}

/** Squarified treemap in normalized 0..1 space. */
export type Rect = { x: number; y: number; w: number; h: number };

export function treemap(weights: number[], aspect = 1.9): Rect[] {
  const total = weights.reduce((a, b) => a + b, 0) || 1;
  const items = weights.map((w, i) => ({ i, v: w / total }));
  items.sort((a, b) => b.v - a.v);
  const out: Rect[] = new Array(weights.length);

  let x = 0,
    y = 0,
    w = 1,
    h = 1;
  let idx = 0;

  const layoutRow = (row: typeof items, rowSum: number, vertical: boolean) => {
    let offset = 0;
    for (const it of row) {
      const share = rowSum > 0 ? it.v / rowSum : 1 / row.length;
      if (vertical) {
        const rw = (rowSum / h) * w * 0 + (rowSum * (w * h)) / (h * (w * h)) * w;
        const width = rowSum / h;
        out[it.i] = { x, y: y + offset * h, w: width, h: share * h };
        void rw;
        offset += share;
      } else {
        const height = rowSum / w;
        out[it.i] = { x: x + offset * w, y, w: share * w, h: height };
        offset += share;
      }
    }
    if (vertical) {
      const width = rowSum / h;
      x += width;
      w -= width;
    } else {
      const height = rowSum / w;
      y += height;
      h -= height;
    }
  };

  const worst = (row: number[], length: number, sum: number) => {
    const side = sum / length;
    const max = Math.max(...row);
    const min = Math.min(...row);
    return Math.max((length * length * max) / (sum * sum), (sum * sum) / (length * length * min));
  };

  while (idx < items.length) {
    const vertical = w * aspect >= h;
    const length = vertical ? h : w;
    const row: typeof items = [];
    let sum = 0;
    while (idx < items.length) {
      const next = items[idx];
      const candidate = [...row.map((r) => r.v), next.v];
      if (row.length === 0 || worst(candidate, length, sum + next.v) <= worst(row.map((r) => r.v), length, sum)) {
        row.push(next);
        sum += next.v;
        idx++;
      } else break;
    }
    layoutRow(row, sum, vertical);
  }

  return out;
}
