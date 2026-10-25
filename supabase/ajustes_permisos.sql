-- Dos ajustes de permisos que salieron al probar todo el flujo

-- El mapa público necesita leer ubicaciones; la policy ubicaciones_select_anon deja solo las de alertas
grant select on public.ubicaciones to anon;

-- rls_auto_enable ya venía en el proyecto de Supabase y no debe poder llamarse desde la API
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
