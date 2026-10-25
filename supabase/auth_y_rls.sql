-- Auth, roles y RLS. Hace lo que antes hacía Spring Security.
-- Al registrarse, el frontend manda nombres, apellidos y teléfono en options.data
-- de signUp. El trigger crea el perfil siempre como CIUDADANO y nunca lee el rol
-- que venga del cliente.

alter table public.perfiles
    add constraint perfiles_telefono_9_digitos check (telefono is null or telefono ~ '^[0-9]{9}$');

-- Estas funciones viven en el esquema private para que la API no las exponga
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated, anon;

create function private.es_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.perfiles p
        join public.roles r on r.id_rol = p.id_rol
        where p.auth_id = (select auth.uid())
          and r.nombre = 'ADMINISTRADOR'
          and p.estado = 'ACTIVO'
    );
$$;

create function private.mi_id_usuario()
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
    select p.id_usuario from public.perfiles p where p.auth_id = (select auth.uid());
$$;

revoke all on function private.es_admin() from public;
revoke all on function private.mi_id_usuario() from public;
grant execute on function private.es_admin() to authenticated, anon;
grant execute on function private.mi_id_usuario() to authenticated, anon;

-- Crea el perfil cuando alguien se registra
create function private.crear_perfil_al_registrarse()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_id_usuario bigint;
begin
    insert into public.perfiles (auth_id, id_rol, nombres, apellidos, correo, telefono)
    values (
        new.id,
        (select id_rol from public.roles where nombre = 'CIUDADANO'),
        coalesce(nullif(trim(new.raw_user_meta_data ->> 'nombres'), ''), 'Sin nombre'),
        coalesce(nullif(trim(new.raw_user_meta_data ->> 'apellidos'), ''), 'Sin apellido'),
        new.email,
        nullif(trim(new.raw_user_meta_data ->> 'telefono'), '')
    )
    returning id_usuario into v_id_usuario;

    insert into public.preferencias_notificacion (id_usuario) values (v_id_usuario);
    return new;
end;
$$;

revoke all on function private.crear_perfil_al_registrarse() from public;

create trigger al_registrarse_crear_perfil
    after insert on auth.users
    for each row execute function private.crear_perfil_al_registrarse();

-- anon solo puede leer los catálogos públicos y las alertas
revoke all on all tables in schema public from anon;
grant select on
    public.roles, public.categorias_emergencia, public.niveles_riesgo, public.estados_reporte,
    public.estados_alerta, public.tipos_contacto, public.contactos_emergencia,
    public.categorias_prevencion, public.informacion_prevencion, public.alertas
to anon;

-- En estas tablas solo se pueden editar ciertas columnas
revoke update on public.perfiles from authenticated;
grant update (nombres, apellidos, telefono, ultima_conexion) on public.perfiles to authenticated;
revoke update on public.notificaciones from authenticated;
grant update (leida) on public.notificaciones to authenticated;
revoke update on public.preferencias_notificacion from authenticated;
grant update (recibir_alertas, recibir_reportes, recibir_prevencion, radio_km) on public.preferencias_notificacion to authenticated;

alter table public.roles enable row level security;
alter table public.perfiles enable row level security;
alter table public.ubicaciones enable row level security;
alter table public.categorias_emergencia enable row level security;
alter table public.niveles_riesgo enable row level security;
alter table public.estados_reporte enable row level security;
alter table public.reportes enable row level security;
alter table public.verificaciones enable row level security;
alter table public.estados_alerta enable row level security;
alter table public.alertas enable row level security;
alter table public.historial_alertas enable row level security;
alter table public.notificaciones enable row level security;
alter table public.preferencias_notificacion enable row level security;
alter table public.tipos_contacto enable row level security;
alter table public.contactos_emergencia enable row level security;
alter table public.categorias_prevencion enable row level security;
alter table public.informacion_prevencion enable row level security;
alter table public.auditoria enable row level security;

-- Catálogos de lectura pública
create policy roles_lectura on public.roles for select to anon, authenticated using (true);
create policy niveles_lectura on public.niveles_riesgo for select to anon, authenticated using (true);
create policy estados_reporte_lectura on public.estados_reporte for select to anon, authenticated using (true);
create policy estados_alerta_lectura on public.estados_alerta for select to anon, authenticated using (true);
create policy tipos_contacto_lectura on public.tipos_contacto for select to anon, authenticated using (true);

-- Catálogos que edita el admin: los lee cualquiera, los escribe solo él
create policy categorias_emergencia_lectura on public.categorias_emergencia for select to anon, authenticated using (true);
create policy categorias_emergencia_admin on public.categorias_emergencia for all to authenticated
    using ((select private.es_admin())) with check ((select private.es_admin()));

create policy contactos_lectura on public.contactos_emergencia for select to anon, authenticated using (true);
create policy contactos_admin on public.contactos_emergencia for all to authenticated
    using ((select private.es_admin())) with check ((select private.es_admin()));

create policy categorias_prevencion_lectura on public.categorias_prevencion for select to anon, authenticated using (true);
create policy categorias_prevencion_admin on public.categorias_prevencion for all to authenticated
    using ((select private.es_admin())) with check ((select private.es_admin()));

create policy info_prevencion_lectura on public.informacion_prevencion for select to anon, authenticated using (true);
create policy info_prevencion_admin on public.informacion_prevencion for all to authenticated
    using ((select private.es_admin())) with check ((select private.es_admin()));

-- Cada usuario ve y edita su perfil (solo algunas columnas). El admin los ve todos.
create policy perfiles_select on public.perfiles for select to authenticated
    using (auth_id = (select auth.uid()) or (select private.es_admin()));
create policy perfiles_update_propio on public.perfiles for update to authenticated
    using (auth_id = (select auth.uid())) with check (auth_id = (select auth.uid()));

-- El ciudadano ve sus reportes y el admin todos. Para escribir hay que usar las RPC.
create policy reportes_select on public.reportes for select to authenticated
    using (id_usuario = (select private.mi_id_usuario()) or (select private.es_admin()));

-- Una ubicación se ve si es de una alerta, de un reporte propio, o si eres admin
create policy ubicaciones_select_anon on public.ubicaciones for select to anon
    using (exists (select 1 from public.alertas a where a.id_ubicacion = ubicaciones.id_ubicacion));
create policy ubicaciones_select on public.ubicaciones for select to authenticated
    using (
        exists (select 1 from public.alertas a where a.id_ubicacion = ubicaciones.id_ubicacion)
        or (select private.es_admin())
        or exists (
            select 1 from public.reportes r
            where r.id_ubicacion = ubicaciones.id_ubicacion
              and r.id_usuario = (select private.mi_id_usuario())
        )
    );

-- Las verificaciones solo las lee el admin y se escriben por RPC
create policy verificaciones_select on public.verificaciones for select to authenticated
    using ((select private.es_admin()));

-- Las alertas las lee cualquiera y las gestiona el admin
create policy alertas_lectura on public.alertas for select to anon, authenticated using (true);
create policy alertas_admin on public.alertas for all to authenticated
    using ((select private.es_admin())) with check ((select private.es_admin()));

-- Historial y auditoría: solo los lee el admin y los llenan triggers y RPC
create policy historial_select on public.historial_alertas for select to authenticated
    using ((select private.es_admin()));
create policy auditoria_select on public.auditoria for select to authenticated
    using ((select private.es_admin()));

-- Cada usuario solo ve sus notificaciones y preferencias
create policy notificaciones_select on public.notificaciones for select to authenticated
    using (id_usuario = (select private.mi_id_usuario()));
create policy notificaciones_update on public.notificaciones for update to authenticated
    using (id_usuario = (select private.mi_id_usuario()))
    with check (id_usuario = (select private.mi_id_usuario()));

create policy preferencias_select on public.preferencias_notificacion for select to authenticated
    using (id_usuario = (select private.mi_id_usuario()));
create policy preferencias_update on public.preferencias_notificacion for update to authenticated
    using (id_usuario = (select private.mi_id_usuario()))
    with check (id_usuario = (select private.mi_id_usuario()));
