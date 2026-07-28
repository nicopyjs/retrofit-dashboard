export const PIPELINE_ID = 3;

// Cada año se crea una nueva etapa "Adjudicada YYYY" / "Perdido YYYY" en Pipedrive
// (el corte no siempre ocurre el 1 de enero — agregar el id de la etapa nueva aquí
// apenas se cree, para que los deals del año no queden "perdidos" fuera del dashboard).
export const STAGE_ADJ_IDS = [18, 29, 78, 84]; // Adjudicada 2023 / 2024 / 2025 / 2026
export const STAGE_PERD_IDS = [19, 37, 82, 85]; // PERDIDO / Perdidos 2024 / Perdido 2025 / Perdido 2026
export const STAGE_ENV = 14; // Enviada (etapa única, no cambia por año)

// Campo personalizado de Pipedrive con la fecha real de adjudicación (rellenada a mano).
// Se usa para ubicar el deal en el trimestre/mes correcto; si no está rellena, se usa
// stage_change_time como respaldo.
export const CUSTOM_FIELD_FECHA_ADJUDICACION = "f5bc19dd75450682394fb14761fefcbd82a0d2ce";

export const UF_RATE = 39000; // CLP por 1 UF — actualizar mensualmente
