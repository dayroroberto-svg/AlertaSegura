-- Cifras reales para Inicio y Login. Solo devuelve totales, nunca filas:
-- por eso puede verlas cualquiera aunque reportes y ubicaciones estén protegidos por RLS.
create function public.estadisticas_publicas()
returns json
language sql
stable
security definer
set search_path = ''
as $$
    select json_build_object(
        'alertas_activas', (
            select count(*) from public.alertas a
            join public.estados_alerta e on e.id_estado_alerta = a.id_estado_alerta
            where e.nombre in ('ACTIVA', 'EN_SEGUIMIENTO', 'CONTROLADA')
        ),
        'reportes_recibidos', (select count(*) from public.reportes),
        'reportes_verificados', (
            select count(*) from public.reportes r
            join public.estados_reporte e on e.id_estado = r.id_estado
            where e.nombre = 'VERIFICADO'
        ),
        'distritos', (
            select count(distinct u.distrito) from public.alertas a
            join public.ubicaciones u on u.id_ubicacion = a.id_ubicacion
            where nullif(trim(u.distrito), '') is not null
        )
    );
$$;

revoke all on function public.estadisticas_publicas() from public;
grant execute on function public.estadisticas_publicas() to anon, authenticated;
