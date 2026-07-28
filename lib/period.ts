import { parseDealDate, type NormalizedDeal } from "./deals";

export type PeriodType = "month" | "quarter" | "year" | "all";

export interface DateRange {
  start: Date;
  end: Date;
  label: string;
}

const MONTH_LABELS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function computePeriodRange(type: PeriodType, offset: number, now: Date = new Date()): DateRange | null {
  if (type === "all") return null;

  if (type === "month") {
    const base = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const start = new Date(base.getFullYear(), base.getMonth(), 1);
    const end = new Date(base.getFullYear(), base.getMonth() + 1, 1);
    return { start, end, label: `${MONTH_LABELS[base.getMonth()]} ${base.getFullYear()}` };
  }

  if (type === "year") {
    const year = now.getFullYear() + offset;
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    return { start, end, label: `${year}` };
  }

  const currentQuarterIndex = Math.floor(now.getMonth() / 3);
  const baseQuarterIndex = currentQuarterIndex + offset;
  const yearOffset = Math.floor(baseQuarterIndex / 4);
  const quarter = ((baseQuarterIndex % 4) + 4) % 4;
  const year = now.getFullYear() + yearOffset;
  const start = new Date(year, quarter * 3, 1);
  const end = new Date(year, quarter * 3 + 3, 1);
  return { start, end, label: `T${quarter + 1} ${year}` };
}

export function filterByDateRange(deals: NormalizedDeal[], range: DateRange | null): NormalizedDeal[] {
  if (!range) return deals;
  return deals.filter((d) => {
    const t = parseDealDate(d.periodDate);
    if (!t) return false;
    return t >= range.start && t < range.end;
  });
}
