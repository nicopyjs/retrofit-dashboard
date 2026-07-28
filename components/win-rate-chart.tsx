"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { MonthlyPoint } from "@/lib/deals";

const chartConfig: ChartConfig = {
  winRate: { label: "Tasa de adjudicación", color: "var(--chart-4)" },
};

export function WinRateChart({ data }: { data: MonthlyPoint[] }) {
  const points = data.filter((p) => p.winRate !== null);

  if (points.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4 rounded-xl border-0 p-5.5 ring-1 ring-border">
      <div className="mb-4.5 font-display text-[13px] font-semibold tracking-wider text-muted-foreground uppercase">
        Tasa de adjudicación en el tiempo
        <span className="ml-2 font-mono text-[10px] font-normal tracking-normal text-muted-foreground normal-case">
          adjudicados / (adjudicados + perdidos) por período
        </span>
      </div>
      <ChartContainer config={chartConfig} className="aspect-auto h-[180px] w-full">
        <LineChart data={points} margin={{ left: -12, right: 12 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }}
          />
          <YAxis
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }}
            tickFormatter={(v) => `${v}%`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value) => <span className="text-foreground">Tasa: {String(value)}%</span>}
              />
            }
          />
          <Line
            dataKey="winRate"
            type="monotone"
            stroke="var(--chart-4)"
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls
          />
        </LineChart>
      </ChartContainer>
    </Card>
  );
}
