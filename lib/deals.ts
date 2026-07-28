import type { PipedriveDeal } from "./pipedrive";
import {
  PIPELINE_ID,
  STAGE_ADJ_IDS,
  STAGE_PERD_IDS,
  STAGE_ENV,
  CUSTOM_FIELD_FECHA_ADJUDICACION,
  UF_RATE,
} from "./constants";

export interface NormalizedDeal extends PipedriveDeal {
  rawValue: number;
  value: number;
  /** Fecha usada para ubicar el deal en un período (trimestre/mes). */
  periodDate: string | null;
}

/**
 * Pipedrive devuelve fechas en dos formatos: "YYYY-MM-DD" (campos personalizados,
 * sin hora) y "YYYY-MM-DD HH:mm:ss" (campos del sistema). Ambos se normalizan a
 * hora local antes de parsear — una fecha sin hora interpretada como UTC puede
 * caer en el día anterior según la zona horaria del navegador.
 */
export function parseDealDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value.replace(" ", "T");
  const date = new Date(iso);
  return isNaN(date.getTime()) ? null : date;
}

export function normalizeDeal(r: PipedriveDeal): NormalizedDeal {
  const rawValue = Number(r.value) || 0;
  const currency = r.currency || "CLP";
  const stageId = Number(r.stage_id);
  const fechaAdjudicacion = r[CUSTOM_FIELD_FECHA_ADJUDICACION];
  const periodDate = STAGE_ADJ_IDS.includes(stageId)
    ? (typeof fechaAdjudicacion === "string" && fechaAdjudicacion ? fechaAdjudicacion : r.stage_change_time)
    : r.stage_change_time;

  return {
    ...r,
    stage_id: stageId,
    pipeline_id: Number(r.pipeline_id),
    rawValue,
    currency,
    value: currency === "CLF" ? rawValue * UF_RATE : rawValue,
    periodDate,
  };
}

export function cleanTitle(title: string): string {
  return title.replace(/^(PSC|PCS)-\d+-\d+\s*-\s*(METROGAS\s*-\s*)?/i, "").trim() || title;
}

export function fmt(val: number): string {
  if (val >= 1e9) return "$" + (val / 1e9).toFixed(1) + "B";
  if (val >= 1e6) return "$" + Math.round(val / 1e6) + "M";
  return "$" + Math.round(val).toLocaleString("es-CL");
}

export function fmtDeal(rawValue: number, currency: string): string {
  if (currency === "CLF") {
    if (rawValue >= 1000) return "UF " + (rawValue / 1000).toFixed(1) + "k";
    return "UF " + Math.round(rawValue).toLocaleString("es-CL");
  }
  return fmt(rawValue);
}

function isTrackedStage(stageId: number): boolean {
  return STAGE_ADJ_IDS.includes(stageId) || STAGE_PERD_IDS.includes(stageId) || stageId === STAGE_ENV;
}

export function filterOpenPipelineDeals(rows: PipedriveDeal[]): NormalizedDeal[] {
  return rows
    .filter((r) => Number(r.pipeline_id) === PIPELINE_ID && r.status === "open" && isTrackedStage(Number(r.stage_id)))
    .map(normalizeDeal);
}

export function filterAllPipelineDeals(rows: PipedriveDeal[]): NormalizedDeal[] {
  return rows
    .filter((r) => Number(r.pipeline_id) === PIPELINE_ID && isTrackedStage(Number(r.stage_id)))
    .map(normalizeDeal);
}

export interface Kpis {
  sumAdj: number;
  sumPerd: number;
  sumEnv: number;
  tasa: number;
  ticket: number;
  countAdj: number;
  countPerd: number;
  countEnv: number;
}

export function computeKpis(adj: NormalizedDeal[], perd: NormalizedDeal[], env: NormalizedDeal[]): Kpis {
  const sumAdj = adj.reduce((a, d) => a + d.value, 0);
  const sumPerd = perd.reduce((a, d) => a + d.value, 0);
  const sumEnv = env.reduce((a, d) => a + d.value, 0);
  const denom = adj.length + perd.length;
  const tasa = denom > 0 ? adj.length / denom : 0;
  const ticket = adj.length ? sumAdj / adj.length : 0;
  return {
    sumAdj,
    sumPerd,
    sumEnv,
    tasa,
    ticket,
    countAdj: adj.length,
    countPerd: perd.length,
    countEnv: env.length,
  };
}

export interface OwnerStats {
  owner: string;
  sumAdj: number;
  sumEnv: number;
  sumPerd: number;
  tasa: number;
}

export function computeOwnerStats(
  deals: NormalizedDeal[],
  adj: NormalizedDeal[],
  env: NormalizedDeal[],
  perd: NormalizedDeal[]
): OwnerStats[] {
  const owners = [...new Set(deals.map((d) => d.owner_name).filter((o): o is string => Boolean(o)))];
  return owners.map((owner) => {
    const oAdj = adj.filter((d) => d.owner_name === owner);
    const oEnv = env.filter((d) => d.owner_name === owner);
    const oPerd = perd.filter((d) => d.owner_name === owner);
    const denom = oAdj.length + oPerd.length;
    return {
      owner,
      sumAdj: oAdj.reduce((a, d) => a + d.value, 0),
      sumEnv: oEnv.reduce((a, d) => a + d.value, 0),
      sumPerd: oPerd.reduce((a, d) => a + d.value, 0),
      tasa: denom > 0 ? Math.round((oAdj.length / denom) * 100) : 0,
    };
  });
}

export interface LossReason {
  label: string;
  count: number;
  pct: number;
}

export function computeLossReasons(perd: NormalizedDeal[]): LossReason[] {
  const razones: Record<string, number> = {};
  perd.forEach((d) => {
    const r = (d.lost_reason || "").trim();
    const key = r ? r.charAt(0).toUpperCase() + r.slice(1).toLowerCase() : "Sin razón registrada";
    razones[key] = (razones[key] || 0) + 1;
  });
  const total = perd.length;
  return Object.entries(razones)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count, pct: total ? Math.round((count / total) * 100) : 0 }));
}

export interface MonthlyPoint {
  month: string;
  label: string;
  adj: number;
  env: number;
  perd: number;
}

export function computeTimeline(allDeals: NormalizedDeal[]): MonthlyPoint[] {
  function groupByMonth(arr: NormalizedDeal[]) {
    const m: Record<string, number> = {};
    arr.forEach((d) => {
      const date = parseDealDate(d.periodDate);
      if (!date) return;
      const key = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");
      m[key] = (m[key] || 0) + d.value;
    });
    return m;
  }

  const adjByMonth = groupByMonth(allDeals.filter((d) => STAGE_ADJ_IDS.includes(d.stage_id)));
  const perdByMonth = groupByMonth(allDeals.filter((d) => STAGE_PERD_IDS.includes(d.stage_id)));
  const envByMonth = groupByMonth(allDeals.filter((d) => d.stage_id === STAGE_ENV));

  const allMonths = [
    ...new Set([...Object.keys(adjByMonth), ...Object.keys(perdByMonth), ...Object.keys(envByMonth)]),
  ].sort();

  let adjCum = 0;
  let perdCum = 0;
  let envCum = 0;

  return allMonths.map((mo) => {
    adjCum += adjByMonth[mo] || 0;
    perdCum += perdByMonth[mo] || 0;
    envCum += envByMonth[mo] || 0;
    const [y, m] = mo.split("-");
    const label = new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString("es-CL", {
      month: "short",
      year: "2-digit",
    });
    return {
      month: mo,
      label,
      adj: Math.round(adjCum / 1e6),
      env: Math.round(envCum / 1e6),
      perd: Math.round(perdCum / 1e6),
    };
  });
}
