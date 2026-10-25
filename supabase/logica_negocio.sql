-- Lógica de negocio: funciones RPC y triggers.
-- El cliente no inserta reportes, ubicaciones ni verificaciones directamente;
-- pasa siempre por estas funciones.

-- Guarda una fila en auditoria
create function private.registrar_auditoria(p_accion text, p_tabla text, p_id_registro bigint, p_descripcion text)
returns void
language sql
security definer
set search_path = ''
as $$
    insert into public.auditoria (id_usuario, accion, tabla_afectada, id_registro, descripcion)
    values (private.mi_id_usuario(), p_accion, p_tabla, p_id_registro, p_descripcion);
$$;
revoke all on function private.registrar_auditoria(text, text, bigint, text) from public;

-- Trigger que anota cada cambio de estado de una alerta
create function private.tg_historial_alerta()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_nuevo text;
    v_anterior text;
begin
    select nombre into v_nuevo from public.estados_alerta where id_estado_alerta = new.id_estado_alerta;
    if tg_op = 'UPDATE' then
        if new.id_estado_alerta = old.id_estado_alerta then
            return new;
        end if;
        select nombre into v_anterior from public.estados_alerta where id_estado_alerta = old.id_estado_alerta;
    end if;

    insert into public.historial_alertas (id_alerta, id_usuario, estado_anterior, estado_nuevo, comentario)
    values (
        new.id_alerta,
        coalesce(private.mi_id_usuario(), new.id_administrador),
        v_anterior,
        v_nuevo,
        nullif(current_setting('app.comentario_historial', true), '')
    );
    return new;
end;
$$;

create trigger alertas_historial
    after insert or update of id_estado_alerta on public.alertas
    for each row execute function private.tg_historial_alerta();

-- Crea un reporte (lo llama el ciudadano)
create function public.crear_reporte(
    p_id_categoria bigint,
    p_id_nivel bigint,
    p_titulo text,
    p_descripcion text default null,
    p_fecha_incidente timestamptz default null,
    p_evidencia_url text default null,
    p_departamento text default null,
    p_provincia text default null,
    p_distrito text default null,
    p_direccion text default null,
    p_latitud numeric default null,
    p_longitud numeric default null,
    p_referencia text default null
)
returns public.reportes
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_usuario public.perfiles;
    v_ubicacion bigint;
    v_reporte public.reportes;
begin
    select * into v_usuario from public.perfiles where auth_id = (select auth.uid());
    if not found or v_usuario.estado <> 'ACTIVO' then
        raise exception 'Usuario no autorizado' using errcode = '42501';
    end if;
    if nullif(trim(p_titulo), '') is null then
        raise exception 'El título es obligatorio' using errcode = '22023';
    end if;
    if (p_latitud is not null and p_latitud not between -90 and 90)
       or (p_longitud is not null and p_longitud not between -180 and 180) then
        raise exception 'Coordenadas fuera de rango' using errcode = '22023';
    end if;
    if not exists (select 1 from public.categorias_emergencia where id_categoria = p_id_categoria and estado = 'ACTIVO') then
        raise exception 'Categoría inválida' using errcode = '22023';
    end if;
    if not exists (select 1 from public.niveles_riesgo where id_nivel = p_id_nivel) then
        raise exception 'Nivel de riesgo inválido' using errcode = '22023';
    end if;

    insert into public.ubicaciones (departamento, provincia, distrito, direccion, latitud, longitud, referencia)
    values (p_departamento, p_provincia, p_distrito, p_direccion, p_latitud, p_longitud, p_referencia)
    returning id_ubicacion into v_ubicacion;

    insert into public.reportes (
        codigo_reporte, id_usuario, id_categoria, id_ubicacion, id_nivel, id_estado,
        titulo, descripcion, fecha_incidente, evidencia_url
    )
    values (
        'REP-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
        v_usuario.id_usuario, p_id_categoria, v_ubicacion, p_id_nivel,
        (select id_estado from public.estados_reporte where nombre = 'PENDIENTE'),
        trim(p_titulo), p_descripcion, p_fecha_incidente, p_evidencia_url
    )
    returning * into v_reporte;

    perform private.registrar_auditoria('CREAR_REPORTE', 'reportes', v_reporte.id_reporte, v_reporte.codigo_reporte);
    return v_reporte;
end;
$$;

-- Verifica o rechaza un reporte (admin)
create function public.verificar_reporte(p_id_reporte bigint, p_resultado text, p_comentarios text default null)
returns public.reportes
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_admin bigint;
    v_reporte public.reportes;
    v_estado text;
begin
    if not (select private.es_admin()) then
        raise exception 'Solo un administrador puede verificar reportes' using errcode = '42501';
    end if;
    if p_resultado not in ('VERIFICADO', 'RECHAZADO') then
        raise exception 'Resultado inválido' using errcode = '22023';
    end if;
    if p_resultado = 'RECHAZADO' and nullif(trim(p_comentarios), '') is null then
        raise exception 'Indica el motivo del rechazo' using errcode = '22023';
    end if;

    v_admin := private.mi_id_usuario();

    select * into v_reporte from public.reportes where id_reporte = p_id_reporte for update;
    if not found then
        raise exception 'Reporte no encontrado' using errcode = 'P0002';
    end if;
    select nombre into v_estado from public.estados_reporte where id_estado = v_reporte.id_estado;
    if v_estado not in ('PENDIENTE', 'EN_REVISION') then
        raise exception 'El reporte ya fue resuelto (%)', v_estado using errcode = '55000';
    end if;

    insert into public.verificaciones (id_reporte, id_administrador, resultado, comentarios)
    values (p_id_reporte, v_admin, p_resultado, p_comentarios);

    update public.reportes
    set id_estado = (select id_estado from public.estados_reporte where nombre = p_resultado),
        observaciones_admin = p_comentarios
    where id_reporte = p_id_reporte
    returning * into v_reporte;

    insert into public.notificaciones (id_usuario, titulo, mensaje, tipo)
    select v_reporte.id_usuario,
           case p_resultado when 'VERIFICADO' then 'Tu reporte fue verificado' else 'Tu reporte fue rechazado' end,
           v_reporte.codigo_reporte || ' - ' || v_reporte.titulo || coalesce(': ' || nullif(trim(p_comentarios), ''), ''),
           'REPORTE'
    from public.preferencias_notificacion pr
    where pr.id_usuario = v_reporte.id_usuario and pr.recibir_reportes;

    perform private.registrar_auditoria('VERIFICAR_REPORTE', 'reportes', p_id_reporte, p_resultado);
    return v_reporte;
end;
$$;

-- Pasa un reporte a EN_REVISION o ARCHIVADO (admin)
create function public.cambiar_estado_reporte(p_id_reporte bigint, p_estado text)
returns public.reportes
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_reporte public.reportes;
begin
    if not (select private.es_admin()) then
        raise exception 'Solo un administrador puede cambiar el estado' using errcode = '42501';
    end if;
    if p_estado not in ('EN_REVISION', 'ARCHIVADO') then
        raise exception 'Estado no permitido' using errcode = '22023';
    end if;

    update public.reportes
    set id_estado = (select id_estado from public.estados_reporte where nombre = p_estado)
    where id_reporte = p_id_reporte
    returning * into v_reporte;
    if not found then
        raise exception 'Reporte no encontrado' using errcode = 'P0002';
    end if;

    perform private.registrar_auditoria('ESTADO_REPORTE', 'reportes', p_id_reporte, p_estado);
    return v_reporte;
end;
$$;

-- Crea una alerta a partir de un reporte verificado (admin)
create function public.crear_alerta_desde_reporte(
    p_id_reporte bigint,
    p_titulo text default null,
    p_descripcion text default null,
    p_recomendaciones text default null,
    p_id_nivel bigint default null
)
returns public.alertas
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_reporte public.reportes;
    v_alerta public.alertas;
    v_estado text;
begin
    if not (select private.es_admin()) then
        raise exception 'Solo un administrador puede crear alertas' using errcode = '42501';
    end if;

    select * into v_reporte from public.reportes where id_reporte = p_id_reporte for update;
    if not found then
        raise exception 'Reporte no encontrado' using errcode = 'P0002';
    end if;
    select nombre into v_estado from public.estados_reporte where id_estado = v_reporte.id_estado;
    if v_estado <> 'VERIFICADO' then
        raise exception 'Solo se puede crear una alerta desde un reporte verificado' using errcode = '55000';
    end if;
    if exists (select 1 from public.alertas where id_reporte = p_id_reporte) then
        raise exception 'Este reporte ya tiene una alerta' using errcode = '23505';
    end if;

    insert into public.alertas (
        codigo_alerta, id_reporte, id_administrador, id_categoria, id_ubicacion, id_nivel,
        id_estado_alerta, titulo, descripcion, recomendaciones
    )
    values (
        'ALE-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
        v_reporte.id_reporte,
        private.mi_id_usuario(),
        v_reporte.id_categoria,
        v_reporte.id_ubicacion,
        coalesce(p_id_nivel, v_reporte.id_nivel),
        (select id_estado_alerta from public.estados_alerta where nombre = 'ACTIVA'),
        coalesce(nullif(trim(p_titulo), ''), v_reporte.titulo),
        coalesce(p_descripcion, v_reporte.descripcion),
        p_recomendaciones
    )
    returning * into v_alerta;

    -- Avisa a los ciudadanos activos que aceptan alertas
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

-- Cambia el estado de una alerta (admin). El historial lo escribe el trigger.
create function public.cambiar_estado_alerta(p_id_alerta bigint, p_estado text, p_comentario text default null)
returns public.alertas
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_alerta public.alertas;
    v_id_estado bigint;
begin
    if not (select private.es_admin()) then
        raise exception 'Solo un administrador puede cambiar el estado' using errcode = '42501';
    end if;
    select id_estado_alerta into v_id_estado from public.estados_alerta where nombre = p_estado;
    if v_id_estado is null then
        raise exception 'Estado de alerta inválido' using errcode = '22023';
    end if;

    perform set_config('app.comentario_historial', coalesce(p_comentario, ''), true);

    update public.alertas
    set id_estado_alerta = v_id_estado,
        fecha_actualizacion = now(),
        fecha_finalizacion = case when p_estado in ('FINALIZADA', 'CANCELADA') then now() else null end
    where id_alerta = p_id_alerta
    returning * into v_alerta;
    if not found then
        raise exception 'Alerta no encontrada' using errcode = 'P0002';
    end if;

    perform private.registrar_auditoria('ESTADO_ALERTA', 'alertas', p_id_alerta, p_estado);
    return v_alerta;
end;
$$;

-- Activa o desactiva usuarios (admin)
create function public.cambiar_estado_usuario(p_id_usuario bigint, p_estado text)
returns public.perfiles
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_perfil public.perfiles;
begin
    if not (select private.es_admin()) then
        raise exception 'Solo un administrador puede gestionar usuarios' using errcode = '42501';
    end if;
    if p_estado not in ('ACTIVO', 'INACTIVO', 'BLOQUEADO') then
        raise exception 'Estado de usuario inválido' using errcode = '22023';
    end if;
    if p_id_usuario = private.mi_id_usuario() then
        raise exception 'No puedes cambiar tu propio estado' using errcode = '42501';
    end if;

    update public.perfiles set estado = p_estado where id_usuario = p_id_usuario returning * into v_perfil;
    if not found then
        raise exception 'Usuario no encontrado' using errcode = 'P0002';
    end if;

    perform private.registrar_auditoria('ESTADO_USUARIO', 'perfiles', p_id_usuario, p_estado);
    return v_perfil;
end;
$$;

-- Solo los usuarios con sesión pueden llamar a las RPC
revoke all on function public.crear_reporte(bigint, bigint, text, text, timestamptz, text, text, text, text, text, numeric, numeric, text) from public, anon;
revoke all on function public.verificar_reporte(bigint, text, text) from public, anon;
revoke all on function public.cambiar_estado_reporte(bigint, text) from public, anon;
revoke all on function public.crear_alerta_desde_reporte(bigint, text, text, text, bigint) from public, anon;
revoke all on function public.cambiar_estado_alerta(bigint, text, text) from public, anon;
revoke all on function public.cambiar_estado_usuario(bigint, text) from public, anon;
grant execute on function public.crear_reporte(bigint, bigint, text, text, timestamptz, text, text, text, text, text, numeric, numeric, text) to authenticated;
grant execute on function public.verificar_reporte(bigint, text, text) to authenticated;
grant execute on function public.cambiar_estado_reporte(bigint, text) to authenticated;
grant execute on function public.crear_alerta_desde_reporte(bigint, text, text, text, bigint) to authenticated;
grant execute on function public.cambiar_estado_alerta(bigint, text, text) to authenticated;
grant execute on function public.cambiar_estado_usuario(bigint, text) to authenticated;
