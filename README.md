# Retrofit Deals Dashboard — NEB Chile

Dashboard de pipeline de ventas, Next.js (App Router) con datos en vivo desde la API de Pipedrive y gráficos con [shadcn/ui charts](https://ui.shadcn.com/docs/components/chart) (Recharts).

## Estructura del proyecto

```
retrofit-dashboard/
├── app/
│   ├── layout.tsx            ← fonts, metadata, Vercel Analytics
│   ├── page.tsx               ← renderiza <Dashboard/>
│   ├── globals.css            ← tema (colores, tipografías)
│   └── api/deals/route.ts     ← fetch paginado a Pipedrive v1, devuelve JSON
├── components/                ← Dashboard, KPIs, tabla de deals, charts, etc.
│   └── ui/                    ← primitives de shadcn/ui
├── lib/
│   ├── pipedrive.ts           ← fetchAllDeals() + tipos
│   ├── deals.ts                ← agregaciones (KPIs, timeline, por ejecutivo, razones de pérdida)
│   └── constants.ts            ← pipeline/stage IDs, tasa UF
└── README.md
```

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

`app/api/deals/route.ts` necesita estas variables (Vercel → Project Settings → Environment Variables, o `.env.local` en desarrollo):

| Variable              | Descripción                                   |
|------------------------|-----------------------------------------------|
| `PIPEDRIVE_API_TOKEN`  | Token personal de Pipedrive (Settings → Personal Preferences → API) |
| `PIPEDRIVE_DOMAIN`     | Subdominio de la empresa (opcional, default `nebchile`) |

Para desarrollo local con las variables ya configuradas en Vercel, corre `vercel env pull .env.local`.

## Actualizar los datos

`app/api/deals/route.ts` consulta la API de Pipedrive directamente y la respuesta se cachea 5 minutos en el edge de Vercel (`stale-while-revalidate`). El dashboard hace fetch al montar y con el botón **Actualizar**.

## Stages configurados

| Stage ID | Etapa           |
|----------|-----------------|
| 14       | Enviada         |
| 84       | Adjudicada 2026 |
| 85       | Perdido 2026    |

Para cambiar, edita `lib/constants.ts`.

## Deploy en Vercel

```bash
vercel
```

Framework Next.js es zero-config en Vercel — no hace falta `vercel.json`. Asegúrate de configurar las variables de entorno antes del primer deploy.
