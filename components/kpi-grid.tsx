import { Card } from "@/components/ui/card";
import { fmt } from "@/lib/deals";
import type { Kpis } from "@/lib/deals";

const KPIS: Array<{
  key: keyof Kpis | "tasa" | "ticket";
  label: string;
  accent: string;
  value: (k: Kpis) => string;
  sub: (k: Kpis) => string;
}> = [
  {
    key: "sumAdj",
    label: "Adjudicados",
    accent: "bg-chart-1",
    value: (k) => fmt(k.sumAdj),
    sub: (k) => `${k.countAdj} deals · 2026`,
  },
  {
    key: "sumEnv",
    label: "Pipeline enviado",
    accent: "bg-chart-2",
    value: (k) => fmt(k.sumEnv),
    sub: (k) => `${k.countEnv} deals activos`,
  },
  {
    key: "sumPerd",
    label: "Perdidos",
    accent: "bg-chart-3",
    value: (k) => fmt(k.sumPerd),
    sub: (k) => `${k.countPerd} deals · 2026`,
  },
  {
    key: "tasa",
    label: "Tasa adjudicación",
    accent: "bg-chart-4",
    value: (k) => `${Math.round(k.tasa * 100)}%`,
    sub: () => "adj / adj + perd",
  },
  {
    key: "ticket",
    label: "Ticket promedio adj.",
    accent: "bg-foreground",
    value: (k) => fmt(k.ticket),
    sub: () => "por deal",
  },
];

export function KpiGrid({ kpis }: { kpis: Kpis }) {
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
        </Card>
      ))}
    </div>
  );
}
