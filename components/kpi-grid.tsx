import { Card } from "@/components/ui/card";
import { fmt } from "@/lib/deals";
import type { Kpis } from "@/lib/deals";

interface KpiDef {
  key: string;
  label: string;
  accent: string;
  value: (k: Kpis) => string;
  sub: (k: Kpis) => string;
  raw: (k: Kpis) => number;
  deltaKind: "percent" | "points";
  goodDirection: "up" | "down";
}

const KPIS: KpiDef[] = [
  {
    key: "sumAdj",
    label: "Adjudicados",
    accent: "bg-chart-1",
    value: (k) => fmt(k.sumAdj),
    sub: (k) => `${k.countAdj} deals · 2026`,
    raw: (k) => k.sumAdj,
    deltaKind: "percent",
    goodDirection: "up",
  },
  {
    key: "sumEnv",
    label: "Pipeline enviado",
    accent: "bg-chart-2",
    value: (k) => fmt(k.sumEnv),
    sub: (k) => `${k.countEnv} deals activos`,
    raw: (k) => k.sumEnv,
    deltaKind: "percent",
    goodDirection: "up",
  },
  {
    key: "sumPerd",
    label: "Perdidos",
    accent: "bg-chart-3",
    value: (k) => fmt(k.sumPerd),
    sub: (k) => `${k.countPerd} deals · 2026`,
    raw: (k) => k.sumPerd,
    deltaKind: "percent",
    goodDirection: "down",
  },
  {
    key: "tasa",
    label: "Tasa adjudicación",
    accent: "bg-chart-4",
    value: (k) => `${Math.round(k.tasa * 100)}%`,
    sub: () => "adj / adj + perd",
    raw: (k) => k.tasa,
    deltaKind: "points",
    goodDirection: "up",
  },
  {
    key: "ticket",
    label: "Ticket promedio adj.",
    accent: "bg-foreground",
    value: (k) => fmt(k.ticket),
    sub: () => "por deal",
    raw: (k) => k.ticket,
    deltaKind: "percent",
    goodDirection: "up",
  },
];

function Delta({ kpi, kpis, prevKpis }: { kpi: KpiDef; kpis: Kpis; prevKpis: Kpis }) {
  const cur = kpi.raw(kpis);
  const prev = kpi.raw(prevKpis);

  if (kpi.deltaKind === "points") {
    const diff = Math.round(cur * 100) - Math.round(prev * 100);
    if (diff === 0) return <span className="text-muted-foreground">= vs. anterior</span>;
    const positive = kpi.goodDirection === "up" ? diff > 0 : diff < 0;
    return (
      <span className={positive ? "text-chart-1" : "text-chart-3"}>
        {diff > 0 ? "+" : ""}
        {diff}pp vs. anterior
      </span>
    );
  }

  if (prev === 0) {
    return cur > 0 ? <span className="text-chart-1">nuevo</span> : null;
  }

  const pct = Math.round(((cur - prev) / prev) * 100);
  if (pct === 0) return <span className="text-muted-foreground">= vs. anterior</span>;
  const positive = kpi.goodDirection === "up" ? pct > 0 : pct < 0;
  return (
    <span className={positive ? "text-chart-1" : "text-chart-3"}>
      {pct > 0 ? "+" : ""}
      {pct}% vs. anterior
    </span>
  );
}

export function KpiGrid({ kpis, prevKpis }: { kpis: Kpis; prevKpis: Kpis | null }) {
  return (
    <div className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {KPIS.map((kpi) => (
        <Card
          key={kpi.key}
          className="relative overflow-hidden rounded-xl border-0 p-5 ring-1 ring-border transition-colors hover:ring-border-strong"
        >
          <div className={`absolute inset-x-0 top-0 h-0.5 ${kpi.accent}`} />
          <div className="mb-2.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
            {kpi.label}
          </div>
          <div className="font-display text-[28px] leading-none font-bold text-foreground">
            {kpi.value(kpis)}
          </div>
          <div className="mt-1.5 font-mono text-xs text-muted-foreground">{kpi.sub(kpis)}</div>
          {prevKpis && (
            <div className="mt-1 font-mono text-[10px]">
              <Delta kpi={kpi} kpis={kpis} prevKpis={prevKpis} />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
