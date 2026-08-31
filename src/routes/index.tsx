import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { RiskListCard } from "@/components/RiskListCard";
import { RiskMap } from "@/components/RiskMap";
import {
  METRICS,
  RISKS,
  RISK_KINDS,
  STATUS_TABS,
  type MetricId,
  type RiskKindId,
  type RiskStatus,
} from "@/lib/risks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Риски — карта и список операционных рисков | НОРМ" },
      {
        name: "description",
        content:
          "Раздел «Риски»: список карточек рисков и карта рисков по видам с агрегацией факта потерь, лимита и прогноза.",
      },
      { property: "og:title", content: "Риски — карта и список операционных рисков | НОРМ" },
      {
        property: "og:description",
        content:
          "Переключайтесь между списком карточек рисков и картой рисков по видам, фильтруйте по типу риска.",
      },
    ],
  }),
  component: RisksPage,
});

const NAV = [
  "Главная",
  "События",
  "Риски",
  "Оценка ИИ-решений",
  "Риск поведения",
  "Меры",
  "Аналитика",
  "Контрагенты",
  "AI мониторинг",
];

function RisksPage() {
  const [status, setStatus] = useState<RiskStatus>("active");
  const [view, setView] = useState<"list" | "map">("map");
  const [metric, setMetric] = useState<MetricId>("fact");
  const [kindFilter, setKindFilter] = useState<RiskKindId | null>(null);

  const byStatus = useMemo(() => RISKS.filter((r) => r.status === status), [status]);
  const listRisks = useMemo(
    () => (kindFilter ? byStatus.filter((r) => r.kind === kindFilter) : byStatus),
    [byStatus, kindFilter],
  );

  const kindName = RISK_KINDS.find((k) => k.id === kindFilter)?.name;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r border-border bg-surface px-4 py-6 lg:flex">
        <div className="flex items-center gap-2 px-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-xs font-black text-primary-foreground">
            ◆
          </span>
          <span className="text-xl font-black tracking-tight">НОРМ</span>
        </div>
        <div className="rounded-xl bg-card px-3 py-2.5 ring-1 ring-border">
          <p className="text-[0.6875rem] text-muted-foreground">Организация</p>
          <p className="truncate text-sm font-bold">Тестовая компания</p>
        </div>
        <nav className="flex flex-col gap-0.5">
          {NAV.map((item) => (
            <span
              key={item}
              className={`rounded-xl px-3 py-2.5 text-sm font-semibold ${
                item === "Риски"
                  ? "bg-card text-foreground ring-1 ring-border"
                  : "text-muted-foreground"
              }`}
            >
              {item}
            </span>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 md:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-black tracking-tight md:text-3xl">
            — Все риски{" "}
            <sup className="align-super text-sm font-bold text-muted-foreground">
              {byStatus.length}
            </sup>
          </h1>
          <button className="pill bg-card text-violet-foreground ring-1 ring-violet-foreground/30">
            ✦ Выявить новые риски
          </button>
        </header>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1 rounded-full bg-surface p-1 ring-1 ring-border">
            <button
              onClick={() => setView(view === "map" ? "list" : "map")}
              className={`pill ${
                view === "map"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Карта рисков
            </button>
            <span className="px-1 text-muted-foreground">/</span>
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatus(tab.id)}
                className={`pill ${
                  status === tab.id
                    ? "bg-card text-foreground ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setKindFilter(null)}
            title={kindName ? `Вид риска: ${kindName} — нажмите, чтобы сбросить` : "Фильтры не применены"}
            className="pill text-muted-foreground hover:text-foreground"
          >
            Фильтр
            {kindFilter && (
              <span
                aria-label="Фильтр применён"
                className="h-2 w-2 rounded-full bg-destructive"
              />
            )}
          </button>
        </div>

        {view === "map" && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-muted-foreground">Потери:</span>
              <div className="flex items-center gap-1 rounded-full bg-surface p-1 ring-1 ring-border">
                {METRICS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMetric(m.id)}
                    className={`pill ${
                      metric === m.id
                        ? "bg-card text-foreground ring-1 ring-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={downloadMap}
              disabled={downloading}
              className="pill bg-card text-muted-foreground ring-1 ring-border hover:text-foreground disabled:opacity-50"
            >
              ⤓ {downloading ? "Скачивание…" : "Скачать карту"}
            </button>
          </div>
        )}


        <div className="mt-5">
          {view === "map" ? (
            <div ref={mapRef}>
              <RiskMap
                risks={byStatus}
                metric={metric}
                onSelectKind={(kind) => {
                  setKindFilter(kind);
                  setView("list");
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {listRisks.length === 0 ? (
                <p className="rounded-2xl bg-card p-8 text-center text-sm text-muted-foreground ring-1 ring-border">
                  Нет рисков, соответствующих выбранным фильтрам.
                </p>
              ) : (
                listRisks.map((risk) => <RiskListCard key={risk.code} risk={risk} />)
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
