# Sistema de diseño — Retrofit Deals Dashboard

Guía de estilo del dashboard. Los tokens de marca (dorado, negro, tipografía) se
extrajeron del CSS compilado de [nebchile-web](https://nebchile-web.vercel.app)
(`--neb-gold`, `--neb-black`, etc. en su `globals.css`), para que el dashboard
se sienta parte de la misma familia visual que el sitio de NEB — no son
valores inventados.

## Principio general

El dashboard tiene **dos sistemas de color separados** que no se mezclan:

1. **Marca (`--brand-gold`)** — identidad NEB. Se usa en elementos de interfaz
   (títulos, botones, hover, focus, logo). Nunca se usa para representar datos.
2. **Semántico (`--chart-1..5`)** — significado de los datos. Verde = ganado,
   rojo = perdido, azul = en curso. Esto es una convención de semáforo que el
   equipo ya lee de un vistazo; cambiarla por dorado rompería esa lectura
   rápida, así que se mantiene intacta aunque no sea "el color de NEB".

Regla práctica: si el color representa **un número que sube o baja según el
negocio** (adjudicado, perdido, enviado, tasa), es semántico. Si el color es
**decoración de interfaz** (título, botón, borde en hover, spinner), es marca.

## Color

### Marca NEB

| Token | Hex | Uso |
|---|---|---|
| `--brand-gold` | `#D4A800` | Acento de marca: palabra "Deals" en el header, hover de botones, tab activo del filtro de período, spinner de carga |
| `--brand-gold-dark` | `#A88500` | Variante hover/pressed del dorado (no usado aún, disponible como `brand-gold-dark`) |

### Base (dark theme, único tema — sin modo claro)

| Token | Hex | Uso |
|---|---|---|
| `--background` | `#0D0F14` | Fondo de página (casi idéntico al `#0D0D0D` de nebchile-web) |
| `--card` / `--popover` | `#141720` | Fondo de cards |
| `--secondary` / `--muted` / `--accent` | `#1C2030` | Fondos secundarios, tracks de progress bars, owner cards |
| `--foreground` | `#F0F2F8` | Texto principal |
| `--muted-foreground` | `#6B7280` | Texto secundario/labels |
| `--border` | `rgba(255,255,255,.07)` | Bordes por defecto |
| `--border-strong` | `rgba(255,255,255,.12)` | Bordes en hover, dividers |

### Semántico (datos — no tocar sin razón de negocio)

| Token | Hex | Significado |
|---|---|---|
| `--chart-1` | `#22C55E` (verde) | Adjudicado / ganado |
| `--chart-2` | `#60A5FA` (azul) | Enviado / en curso |
| `--chart-3` | `#EF4444` (rojo) | Perdido |
| `--chart-4` | `#F59E0B` (ámbar) | Tasa de adjudicación |
| `--chart-5` | `#A78BFA` (violeta) | Serie extra (ej. avatares de ejecutivos) |

Todos los tokens están expuestos como variables CSS en `app/globals.css` y
como utilidades de Tailwind v4 (`bg-brand-gold`, `text-chart-1`,
`border-border-strong`, etc.) vía el bloque `@theme inline`.

## Tipografía

| Fuente | Uso | Por qué |
|---|---|---|
| **Inter** (`font-display` / `font-sans`) | Títulos, valores de KPI, texto de cuerpo | La misma fuente que usa nebchile-web — alineación 1:1 con el sitio real de la marca |
| **DM Mono** (`font-mono`) | Labels en mayúscula, timestamps, cifras técnicas | Da la sensación de "panel de datos"; no compite con la identidad de marca porque solo se usa en detalles técnicos, no en texto de marca |

Versión anterior usaba Syne (display) + DM Sans (body) — una combinación más
"de portafolio/SaaS genérico" que no correspondía a la marca real de NEB. Se
migró a Inter completo (`app/layout.tsx`, tokens `--font-display`/`--font-sans`
en `globals.css`) para que el dashboard se lea como un producto de NEB, no
como una plantilla.

## Logo

`public/neb-mark.png` — el ísotipo circular (fondo negro, "N" dorada),
recortado del lockup completo de NEB y con fondo transparente. Se usa junto
al título en el header (`components/dashboard.tsx`). El lockup completo con
wordmark "neb" no se incluyó para no competir con el wordmark propio del
dashboard ("Retrofit Deals").

## Componentes

- **Cards**: `rounded-xl`, `ring-1 ring-border`, `p-5.5`, fondo `--card`.
  Título de sección: `font-display text-[13px] font-semibold tracking-wider
  uppercase text-muted-foreground`.
- **KPI cards**: barra de acento de 2px arriba (`--chart-N` para KPIs de
  datos, `bg-foreground` para el KPI neutro de "ticket promedio"), valor en
  `font-display text-[28px] font-bold`.
- **Gráficos**: shadcn/ui chart components sobre Recharts. Cada serie mapea a
  su color semántico vía `var(--chart-N)`, nunca colores arbitrarios.
- **Radius**: `--radius: 0.75rem` como base; el resto de los radios
  (`sm`/`md`/`lg`/`xl`) se derivan de ahí en `globals.css`.

## Fuente de verdad

Si la marca de NEB cambia (nuevo dorado, nuevo logo), actualizar:
1. `--brand-gold` / `--brand-gold-dark` en `app/globals.css`
2. `public/neb-mark.png`
3. Este documento
