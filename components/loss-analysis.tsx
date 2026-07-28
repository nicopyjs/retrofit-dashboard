"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { LossReason } from "@/lib/deals";

const chartConfig: ChartConfig = {
  valor: { label: "Valor" },
};

export function LossAnalysis({
  reasons,
  sumAdjM,
  sumPerdM,
}: {
  reasons: LossReason[];
  sumAdjM: number;
  sumPerdM: number;
}) {
  const barData = [
    { name: "Adjudicado", valor: sumAdjM, fill: "var(--chart-1)" },
    { name: "Perdido", valor: sumPerdM, fill: "var(--chart-3)" },
  ];

  return (
    <Card className="rounded-xl border-0 p-5.5 ring-1 ring-border">
      <div className="mb-4.5 font-display text-[13px] font-semibold tracking-wider text-muted-foreground uppercase">
        Análisis de pérdidas
      </div>
      <div>
        {reasons.map((r) => {
          const isUnregistered = r.label === "Sin razón registrada";
          const barColor = isUnregistered ? "var(--muted-foreground)" : "var(--chart-3)";
          return (
            <div key={r.label} className="mb-4 flex items-center gap-3 last:mb-0">
              <div className="min-w-6 font-mono text-lg font-medium" style={{ color: barColor }}>
                {r.count}
              </div>
              <div className="flex-1">
                <div
                  className="mb-1.5 text-xs"
                  style={{ color: isUnregistered ? "var(--muted-foreground)" : "var(--foreground)" }}
                >
                  {r.label}
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: barColor }} />
                </div>
              </div>
              <div className="font-mono text-[11px] text-muted-foreground">{r.pct}%</div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 mb-4.5 font-display text-[13px] font-semibold tracking-wider text-muted-foreground uppercase">
        Adjudicado vs Perdido (M CLP)
      </div>
      <ChartContainer config={chartConfig} className="aspect-auto h-[140px] w-full">
        <BarChart data={barData}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }}
            tickFormatter={(v) => `$${v}M`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, name) => (
                  <span className="text-foreground">
                    {name}: ${String(value)}M CLP
                  </span>
                )}
              />
            }
          />
          <Bar dataKey="valor" radius={6} maxBarSize={40}>
            {barData.map((d) => (
              <Cell key={d.name} fill={d.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </Card>
  );
}
