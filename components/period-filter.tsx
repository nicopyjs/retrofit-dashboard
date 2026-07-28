"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PeriodType } from "@/lib/period";

const GRANULARITIES: { value: PeriodType; label: string }[] = [
  { value: "month", label: "Mes" },
  { value: "quarter", label: "Trimestre" },
  { value: "all", label: "Todo" },
];

export function PeriodFilter({
  type,
  offset,
  label,
  onTypeChange,
  onOffsetChange,
}: {
  type: PeriodType;
  offset: number;
  label: string | null;
  onTypeChange: (type: PeriodType) => void;
  onOffsetChange: (offset: number) => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <div className="inline-flex rounded-lg bg-secondary p-[3px]">
        {GRANULARITIES.map((g) => (
          <button
            key={g.value}
            onClick={() => {
              onTypeChange(g.value);
              onOffsetChange(0);
            }}
            className={`rounded-md px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase transition-colors ${
              type === g.value
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {type !== "all" && (
        <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
          <button
            onClick={() => onOffsetChange(offset - 1)}
            className="rounded-md p-1 transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Período anterior"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-[92px] text-center text-foreground">{label}</span>
          <button
            onClick={() => onOffsetChange(offset + 1)}
            className="rounded-md p-1 transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Período siguiente"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          {offset !== 0 && (
            <button
              onClick={() => onOffsetChange(0)}
              className="ml-1 rounded-md border border-border-strong px-2 py-0.5 text-[10px] tracking-wider uppercase transition-colors hover:text-foreground"
            >
              Hoy
            </button>
          )}
        </div>
      )}
    </div>
  );
}
