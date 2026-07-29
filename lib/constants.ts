export const PIPELINE_ID = 3;

// Cada año se crea una nueva etapa "Adjudicada YYYY" / "Perdido YYYY" en Pipedrive
// (el corte no siempre ocurre el 1 de enero — agregar el id de la etapa nueva aquí
// apenas se cree, para que los deals del año no queden "perdidos" fuera del dashboard).
export const STAGE_ADJ_IDS = [18, 29, 78, 84]; // Adjudicada 2023 / 2024 / 2025 / 2026
export const STAGE_PERD_IDS = [19, 37, 82, 85]; // PERDIDO / Perdidos 2024 / Perdido 2025 / Perdido 2026
export const STAGE_ENV = 14; // Enviada (etapa única, no cambia por año)

// Etapas tempranas del embudo (antes de "Enviada") — no forman parte de las KPIs
// de cierre (adjudicado/perdido/tasa), pero se muestran como conteo de backlog.
export const STAGE_PROSPECCION = 12;
export const STAGE_VISITAR = 13;
export const STAGE_NEGOCIACION = 15;

// Campos personalizados de Pipedrive con la fecha real de adjudicación / envío
// (rellenados a mano). Se usan para ubicar el deal en el trimestre/mes correcto;
// si no están rellenos, se usa stage_change_time como respaldo.
export const CUSTOM_FIELD_FECHA_ADJUDICACION = "f5bc19dd75450682394fb14761fefcbd82a0d2ce";
export const CUSTOM_FIELD_FECHA_ENVIO = "7bd6a433ad5e8267a7fbdf84c8ddccdb56c8a98f";
export const CUSTOM_FIELD_FECHA_CARTA_OFERTA = "620bf0aa39168841a785da61fbdd4c24213c516a";
export const CUSTOM_FIELD_FECHA_REUNION_CLIENTE = "0c6bd926d60acfe5d533d6a2c31718e2a3f9675b";

// Motivo de rechazo/pérdida rellenado a mano por el equipo — a diferencia del campo
// nativo "lost_reason" de Pipedrive (que casi nunca se usa), este sí tiene datos reales.
export const CUSTOM_FIELD_CAUSA_RECHAZO = "255cbc1b027056f138cd39eadf6621a94777075b";

export const UF_RATE = 39000; // CLP por 1 UF — actualizar mensualmente
