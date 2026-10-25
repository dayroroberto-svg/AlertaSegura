-- Alerta que crea el admin sin un reporte previo. La dirección se guarda como texto.
create function public.crear_alerta_manual(
    p_id_categoria bigint,
    p_id_nivel bigint,
    p_titulo text,
    p_descripcion text default null,
    p_recomendaciones text default null,
    p_direccion text default null
)
returns public.alertas
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_ubicacion bigint;
    v_alerta public.alertas;
begin
    if not (select private.es_admin()) then
        raise exception 'Solo un administrador puede crear alertas' using errcode = '42501';
    end if;
    if nullif(trim(p_titulo), '') is null then
        raise exception 'El título es obligatorio' using errcode = '22023';
    end if;
    if not exists (select 1 from public.categorias_emergencia where id_categoria = p_id_categoria and estado = 'ACTIVO') then
        raise exception 'Categoría inválida' using errcode = '22023';
    end if;
    if not exists (select 1 from public.niveles_riesgo where id_nivel = p_id_nivel) then
        raise exception 'Nivel de riesgo inválido' using errcode = '22023';
    end if;

    insert into public.ubicaciones (direccion) values (nullif(trim(p_direccion), ''))
    returning id_ubicacion into v_ubicacion;

    insert into public.alertas (
        codigo_alerta, id_administrador, id_categoria, id_ubicacion, id_nivel,
        id_estado_alerta, titulo, descripcion, recomendaciones
    )
    values (
        'ALE-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
        private.mi_id_usuario(), p_id_categoria, v_ubicacion, p_id_nivel,
        (select id_estado_alerta from public.estados_alerta where nombre = 'ACTIVA'),
        trim(p_titulo), p_descripcion, p_recomendaciones
    )
    returning * into v_alerta;

    insert into public.notificaciones (id_usuario, id_alerta, titulo, mensaje, tipo)
    select p.id_usuario, v_alerta.id_alerta, 'Nueva alerta: ' || v_alerta.titulo, left(v_alerta.descripcion, 300), 'ALERTA'
    from public.perfiles p
    join public.roles r on r.id_rol = p.id_rol and r.nombre = 'CIUDADANO'
    join public.preferencias_notificacion pr on pr.id_usuario = p.id_usuario
    where p.estado = 'ACTIVO' and pr.recibir_alertas;

    perform private.registrar_auditoria('CREAR_ALERTA', 'alertas', v_alerta.id_alerta, v_alerta.codigo_alerta);
    return v_alerta;
end;
$$;

revoke all on function public.crear_alerta_manual(bigint, bigint, text, text, text, text) from public, anon;
grant execute on function public.crear_alerta_manual(bigint, bigint, text, text, text, text) to authenticated;
