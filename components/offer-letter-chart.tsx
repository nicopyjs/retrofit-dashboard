"use client";

import { Cell, Pie, PieChart } from "recharts";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { OfferLetterStats } from "@/lib/deals";

const config: ChartConfig = { value: { label: "Deals" } };

function MiniDonut({
  title,
  achieved,
  achievedLabel,
  total,
  pct,
  color,
}: {
  title: string;
  achieved: number;
  achievedLabel: string;
  total: number;
  pct: number | null;
  color: string;
}) {
  const gap = Math.max(total - achieved, 0);
  const data = [
    { name: achievedLabel, value: achieved, fill: color },
    { name: "Cartas de oferta", value: gap, fill: "var(--secondary)" },
  ];

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="mb-2 text-center font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
        {title}
      </div>
      <div className="relative h-[120px] w-full max-w-[140px]">
        <ChartContainer config={config} className="aspect-auto h-full w-full">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => (
                    <span className="text-foreground">
                      {name}: {String(value)}
                    </span>
                  )}
                />
              }
            />
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="70%" outerRadius="100%" strokeWidth={0}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-xl font-bold text-foreground">
          {pct !== null ? `${pct}%` : "—"}
        </div>
      </div>
      <div className="mt-2 font-mono text-[11px] text-muted-foreground">
        {achieved} / {total} {achievedLabel.toLowerCase()}
      </div>
    </div>
  );
}

export function OfferLetterChart({ stats }: { stats: OfferLetterStats }) {
  return (
    <Card className="mb-4 rounded-xl border-0 p-5.5 ring-1 ring-border">
      <div className="mb-4.5 flex items-baseline justify-between">
        <div className="font-display text-[13px] font-semibold tracking-wider text-muted-foreground uppercase">
          Cartas de oferta
        </div>
        <div className="font-mono text-[10px] text-muted-foreground normal-case">
          sobre deals cerrados en el período
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <div className="shrink-0">
          <div className="font-display text-[32px] leading-none font-bold text-foreground">
            {stats.cartaOfertaCount}
          </div>
          <div className="mt-1.5 font-mono text-xs text-muted-foreground">cartas enviadas</div>
        </div>
        <div className="flex flex-1 gap-4">
          <MiniDonut
            title="Adjudicados / Cartas"
            achieved={stats.adjCount}
            achievedLabel="Adjudicados"
            total={stats.cartaOfertaCount}
            pct={stats.adjPct}
            color="var(--chart-1)"
          />
          <MiniDonut
            title="Perdidos / Cartas"
            achieved={stats.perdCount}
            achievedLabel="Perdidos"
            total={stats.cartaOfertaCount}
            pct={stats.perdPct}
            color="var(--chart-3)"
          />
        </div>
      </div>
    </Card>
  );
}
