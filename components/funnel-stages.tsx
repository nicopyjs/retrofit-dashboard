const STAGES: { key: string; label: string; accent: string }[] = [
  { key: "visitar", label: "Por visitar", accent: "bg-chart-2" },
  { key: "prospeccion", label: "Por enviar", accent: "bg-chart-4" },
  { key: "enviado", label: "Proyectos en espera", accent: "bg-chart-2" },
  { key: "negociacion", label: "Negociación", accent: "bg-chart-5" },
];

export function FunnelStages({
  porVisitar,
  porEnviar,
  enEspera,
  negociacion,
}: {
  porVisitar: number;
  porEnviar: number;
  enEspera: number;
  negociacion: number;
}) {
  const values: Record<string, number> = {
    visitar: porVisitar,
    prospeccion: porEnviar,
    enviado: enEspera,
    negociacion,
  };

  return (
    <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
      {STAGES.map((s) => (
        <div key={s.key} className="flex items-center gap-3 rounded-xl bg-card p-4 ring-1 ring-border">
          <div className={`h-8 w-1 shrink-0 rounded-full ${s.accent}`} />
          <div>
            <div className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">{s.label}</div>
            <div className="font-display text-xl font-bold text-foreground">{values[s.key]}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
