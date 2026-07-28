import { Card } from "@/components/ui/card";
import { fmt } from "@/lib/deals";
import type { OwnerStats } from "@/lib/deals";

const OWNER_COLORS = ["var(--chart-2)", "var(--chart-4)", "var(--chart-5)", "var(--chart-1)"];

export function OwnerCards({ owners }: { owners: OwnerStats[] }) {
  return (
    <Card className="rounded-xl border-0 p-5.5 ring-1 ring-border">
      <div className="mb-4.5 font-display text-[13px] font-semibold tracking-wider text-muted-foreground uppercase">
        Por ejecutivo
      </div>
      <div className="flex flex-col gap-4">
        {owners.map((o, i) => {
          const color = OWNER_COLORS[i % OWNER_COLORS.length];
          const initials = o.owner.slice(0, 2).toUpperCase();
          return (
            <div key={o.owner} className="rounded-[10px] bg-secondary p-4">
              <div className="mb-3 flex items-center gap-2 font-display text-[15px] font-bold text-foreground">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold"
                  style={{ background: `color-mix(in srgb, ${color} 13%, transparent)`, color }}
                >
                  {initials}
                </div>
                {o.owner}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-card p-2.5 text-center">
                  <div className="font-display text-base font-bold text-chart-1">{fmt(o.sumAdj)}</div>
                  <div className="mt-0.5 font-mono text-[9px] tracking-wider text-muted-foreground uppercase">
                    Adjudicado
                  </div>
                </div>
                <div className="rounded-lg bg-card p-2.5 text-center">
                  <div className="font-display text-base font-bold text-chart-2">{fmt(o.sumEnv)}</div>
                  <div className="mt-0.5 font-mono text-[9px] tracking-wider text-muted-foreground uppercase">
                    Enviado
                  </div>
                </div>
                <div className="rounded-lg bg-card p-2.5 text-center">
                  <div className="font-display text-base font-bold text-chart-3">{fmt(o.sumPerd)}</div>
                  <div className="mt-0.5 font-mono text-[9px] tracking-wider text-muted-foreground uppercase">
                    Perdido
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="mb-1.5 flex justify-between font-mono text-[11px] text-muted-foreground">
                  <span>Tasa adj.</span>
                  <span className="text-foreground">{o.tasa}%</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-card">
                  <div className="h-full rounded-full" style={{ width: `${o.tasa}%`, background: color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
