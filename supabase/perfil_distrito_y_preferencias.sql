-- El distrito es opcional y se pide al registrarse.
-- preferencias guarda los ajustes de la pantalla de configuración del administrador.
alter table public.perfiles
    add column distrito varchar(100),
    add column preferencias jsonb not null default '{}';

grant update (distrito, preferencias) on public.perfiles to authenticated;

-- Misma función de registro, ahora con el distrito
create or replace function private.crear_perfil_al_registrarse()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_id_usuario bigint;
begin
    insert into public.perfiles (auth_id, id_rol, nombres, apellidos, correo, telefono, distrito)
    values (
        new.id,
        (select id_rol from public.roles where nombre = 'CIUDADANO'),
        coalesce(nullif(trim(new.raw_user_meta_data ->> 'nombres'), ''), 'Sin nombre'),
        coalesce(nullif(trim(new.raw_user_meta_data ->> 'apellidos'), ''), 'Sin apellido'),
        new.email,
        nullif(trim(new.raw_user_meta_data ->> 'telefono'), ''),
        nullif(trim(new.raw_user_meta_data ->> 'distrito'), '')
    )
    returning id_usuario into v_id_usuario;

    insert into public.preferencias_notificacion (id_usuario) values (v_id_usuario);
    return new;
end;
$$;
