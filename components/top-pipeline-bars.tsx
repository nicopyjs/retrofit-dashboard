import { Card } from "@/components/ui/card";
import { cleanTitle, fmtDeal } from "@/lib/deals";
import type { NormalizedDeal } from "@/lib/deals";

export function TopPipelineBars({ env }: { env: NormalizedDeal[] }) {
  const top = [...env].sort((a, b) => b.value - a.value).slice(0, 10);
  const maxVal = top[0]?.value || 1;

  return (
    <Card className="rounded-xl border-0 p-5.5 ring-1 ring-border">
      <div className="mb-4.5 font-display text-[13px] font-semibold tracking-wider text-muted-foreground uppercase">
        Top pipeline enviado
      </div>
      <div>
        {top.map((d) => (
          <div key={d.id} className="mb-3.5 last:mb-0">
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="max-w-[180px] truncate text-foreground">{cleanTitle(d.title)}</span>
              <span className="ml-2 shrink-0 font-mono text-[11px] text-muted-foreground">
                {fmtDeal(d.rawValue, d.currency)}
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-chart-2"
                style={{ width: `${Math.round((d.value / maxVal) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
