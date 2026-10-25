-- Resultado de la revisión automática de la foto de evidencia.
-- Lo escribe la Edge Function analizar-evidencia con la clave de servicio; es solo un aviso para el admin.
alter table public.reportes
    add column ia_veredicto varchar(20) check (ia_veredicto in ('COINCIDE', 'DUDOSA', 'NO_COINCIDE', 'ERROR')),
    add column ia_confianza numeric(3, 2) check (ia_confianza between 0 and 1),
    add column ia_motivo text,
    add column ia_analizado_en timestamptz;
