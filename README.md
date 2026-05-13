# Retrofit Deals Dashboard — NEB Chile

Dashboard estático que consume datos en tiempo real desde Google Sheets.

## Estructura del proyecto

```
retrofit-dashboard/
├── index.html     ← toda la app (HTML + CSS + JS)
├── vercel.json    ← configuración de Vercel
└── README.md
```

## Cómo publicar en Vercel

### Opción A — Desde GitHub (recomendado, con deploy automático)

1. Crea un repositorio en GitHub y sube esta carpeta
2. Ve a https://vercel.com → "Add New Project"
3. Conecta tu repositorio de GitHub
4. Vercel detecta automáticamente que es un sitio estático
5. Click en **Deploy**
6. Tu dashboard queda en `https://tu-proyecto.vercel.app`

Cada vez que hagas push al repo, Vercel redeploya automáticamente.

### Opción B — Desde CLI (más rápido)

```bash
npm install -g vercel
cd retrofit-dashboard
vercel
```

Sigue las instrucciones en terminal. En ~30 segundos tienes la URL.

## Actualizar los datos

Los datos se leen **cada vez que alguien abre el dashboard** desde Google Sheets.
No necesitas redeployar nada — solo actualiza el Google Sheet y los cambios
aparecen automáticamente al recargar la página.

También hay un botón **Actualizar** en el dashboard para refrescar sin cerrar la pestaña.

## Cambiar la fuente de datos

En `index.html`, línea ~140:

```js
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/...';
```

Reemplaza con la URL de tu Sheet publicado como CSV.

## Stages configurados

| Stage ID | Etapa          |
|----------|----------------|
| 14       | Enviado        |
| 84       | Adjudicado 2026|
| 85       | Perdido 2026   |

Para cambiar, edita las constantes en `index.html`:

```js
const STAGE_ADJ  = 84;
const STAGE_PERD = 85;
const STAGE_ENV  = 14;
```
