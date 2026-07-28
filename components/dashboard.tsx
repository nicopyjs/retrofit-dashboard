"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { KpiGrid } from "@/components/kpi-grid";
import { DealsTable } from "@/components/deals-table";
import { ValueDonutChart } from "@/components/value-donut-chart";
import { TimelineChart } from "@/components/timeline-chart";
import { TopPipelineBars } from "@/components/top-pipeline-bars";
import { OwnerCards } from "@/components/owner-cards";
import { LossAnalysis } from "@/components/loss-analysis";
import { PeriodFilter } from "@/components/period-filter";
import {
  computeKpis,
  computeLossReasons,
  computeOwnerStats,
  computeTimeline,
  filterAllPipelineDeals,
  filterOpenPipelineDeals,
} from "@/lib/deals";
import { computePeriodRange, filterByDateRange, type PeriodType } from "@/lib/period";
import { STAGE_ADJ, STAGE_ENV, STAGE_PERD, UF_RATE } from "@/lib/constants";
import type { PipedriveDeal } from "@/lib/pipedrive";

export function Dashboard() {
  const [rows, setRows] = useState<PipedriveDeal[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [periodType, setPeriodType] = useState<PeriodType>("all");
  const [periodOffset, setPeriodOffset] = useState(0);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/deals");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: PipedriveDeal[] = await res.json();
      setRows(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount; loadData sets state only after the async request resolves
    loadData();
  }, [loadData]);

  if (loading && !rows) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-secondary border-t-chart-1" />
        <p className="font-mono text-xs text-muted-foreground">Cargando datos desde Pipedrive...</p>
      </div>
    );
  }

  if (error || !rows) {
    return (
      <div className="p-10 text-center font-mono text-[13px] text-chart-3">
        <p>⚠️ No se pudieron cargar los datos.</p>
        <p className="mt-2 text-muted-foreground">Verifica la conexión con la API de Pipedrive.</p>
      </div>
    );
  }

  const allPipelineDeals = filterAllPipelineDeals(rows);
  const dateRange = computePeriodRange(periodType, periodOffset);
  const openDeals = filterByDateRange(filterOpenPipelineDeals(rows), dateRange);

  const adj = openDeals.filter((d) => d.stage_id === STAGE_ADJ);
  const perd = openDeals.filter((d) => d.stage_id === STAGE_PERD);
  const env = openDeals.filter((d) => d.stage_id === STAGE_ENV);

  const kpis = computeKpis(adj, perd, env);
  const ownerStats = computeOwnerStats(openDeals, adj, env, perd);
  const lossReasons = computeLossReasons(perd);
  const timeline = computeTimeline(allPipelineDeals);

  return (
    <div>
      <div className="mb-10 flex items-end justify-between border-b border-border-strong pb-6">
        <div>
          <h1 className="font-display text-[32px] font-extrabold tracking-tight text-white">
            Retrofit <span className="text-chart-1">Deals</span>
          </h1>
          <p className="mt-1.5 font-mono text-[13px] text-muted-foreground">
            NEB Chile · Pipeline 2026 — stages enviado / adjudicado / perdido
          </p>
        </div>
        <div className="text-right font-mono text-[11px] leading-[1.8] text-muted-foreground">
          <span>
            {lastUpdated
              ? "Actualizado " +
                lastUpdated.toLocaleString("es-CL", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—"}
          </span>
          <br />
          Moneda: CLP · UF @ ${UF_RATE.toLocaleString("es-CL")}
          <br />
          <button
            onClick={loadData}
            disabled={loading}
            className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-secondary px-3 py-1.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase transition-colors hover:border-chart-1 hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </div>
      </div>

      <PeriodFilter
        type={periodType}
        offset={periodOffset}
        label={dateRange?.label ?? null}
        onTypeChange={setPeriodType}
        onOffsetChange={setPeriodOffset}
      />

      <KpiGrid kpis={kpis} />

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <DealsTable adj={adj} perd={perd} />
        <ValueDonutChart
          sumEnv={kpis.sumEnv}
          countEnv={kpis.countEnv}
          sumPerd={kpis.sumPerd}
          countPerd={kpis.countPerd}
          sumAdj={kpis.sumAdj}
          countAdj={kpis.countAdj}
        />
      </div>

      <TimelineChart data={timeline} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <TopPipelineBars env={env} />
        <OwnerCards owners={ownerStats} />
        <LossAnalysis
          reasons={lossReasons}
          sumAdjM={Math.round(kpis.sumAdj / 1e6)}
          sumPerdM={Math.round(kpis.sumPerd / 1e6)}
        />
      </div>
    </div>
  );
}
