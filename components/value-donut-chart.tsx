"use client";

import { Cell, Pie, PieChart } from "recharts";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { fmt } from "@/lib/deals";

interface DonutSlice {
  label: string;
  value: number;
  count: number;
  color: string;
}

export function ValueDonutChart({
  sumEnv,
  countEnv,
  sumPerd,
  countPerd,
  sumAdj,
  countAdj,
}: {
  sumEnv: number;
  countEnv: number;
  sumPerd: number;
  countPerd: number;
  sumAdj: number;
  countAdj: number;
}) {
  const data: DonutSlice[] = [
    { label: "Pipeline enviado", value: sumEnv, count: countEnv, color: "var(--chart-2)" },
    { label: "Perdidos 2026", value: sumPerd, count: countPerd, color: "var(--chart-3)" },
    { label: "Adjudicados 2026", value: sumAdj, count: countAdj, color: "var(--chart-1)" },
  ];

  const config: ChartConfig = Object.fromEntries(
    data.map((d) => [d.label, { label: d.label, color: d.color }])
  );

  return (
    <Card className="rounded-xl border-0 p-5.5 ring-1 ring-border">
      <div className="mb-4.5 font-display text-[13px] font-semibold tracking-wider text-muted-foreground uppercase">
        Distribución de valor
      </div>
      <ChartContainer config={config} className="mx-auto aspect-auto h-[180px] w-full">
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, name) => (
                  <span className="text-foreground">
                    {name}: {fmt(Number(value))} CLP
                  </span>
                )}
              />
            }
          />
          <Pie data={data} dataKey="value" nameKey="label" innerRadius="72%" outerRadius="100%" strokeWidth={0}>
            {data.map((d) => (
              <Cell key={d.label} fill={d.color} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="mt-2 space-y-0">
        {data.map((d) => (
          <div key={d.label} className="flex items-center justify-between border-b border-border py-2 text-[12.5px] last:border-0">
            <div className="flex items-center">
              <div className="mr-2.5 h-2 w-2 shrink-0 rounded-full" style={{ background: d.color }} />
              {d.label}
            </div>
            <div className="font-mono text-[11px] text-muted-foreground">
              {fmt(d.value)} · {d.count} deals
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
