"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { MonthlyPoint } from "@/lib/deals";
import { UF_RATE } from "@/lib/constants";

const chartConfig: ChartConfig = {
  adj: { label: "Adjudicados", color: "var(--chart-1)" },
  env: { label: "Enviados", color: "var(--chart-2)" },
  perd: { label: "Perdidos", color: "var(--chart-3)" },
};

export function TimelineChart({ data }: { data: MonthlyPoint[] }) {
  return (
    <Card className="mb-4 rounded-xl border-0 p-5.5 ring-1 ring-border">
      <div className="mb-4.5 flex items-baseline gap-2 font-display text-[13px] font-semibold tracking-wider text-muted-foreground uppercase">
        Evolución acumulada · CLP
        <span className="font-mono text-[10px] font-normal tracking-normal text-muted-foreground normal-case">
          histórico completo · UF convertida a ${UF_RATE.toLocaleString("es-CL")}
        </span>
      </div>
      <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
        <LineChart data={data} margin={{ left: -12, right: 12 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }}
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
                formatter={(value, name) => (
                  <span className="text-foreground">
                    {chartConfig[name as keyof typeof chartConfig]?.label}: ${String(value)}M CLP (acum.)
                  </span>
                )}
              />
            }
          />
          <Line dataKey="adj" type="monotone" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 3 }} />
          <Line dataKey="env" type="monotone" stroke="var(--chart-2)" strokeWidth={2} dot={{ r: 3 }} />
          <Line dataKey="perd" type="monotone" stroke="var(--chart-3)" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ChartContainer>
      <div className="mt-3 flex items-center justify-center gap-5">
        {Object.entries(chartConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <div className="h-2 w-2 rounded-[2px]" style={{ background: cfg.color }} />
            {cfg.label}
          </div>
        ))}
      </div>
    </Card>
  );
}
