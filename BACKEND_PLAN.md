# Plan del backend de AlertaSegura

El backend de AlertaSegura vive en Supabase: Postgres para los datos, Supabase Auth para las cuentas, Row Level Security para los permisos, funciones SQL para la lógica de negocio y Storage para las fotos de evidencia. No hay servidor propio; el frontend Angular habla directo con Supabase.

Los scripts SQL están en `supabase/`. Si hay que crear la base desde cero, se ejecutan en el SQL Editor en este orden:

1. `esquema_inicial.sql`
2. `auth_y_rls.sql`
3. `logica_negocio.sql`
4. `ajustes_permisos.sql`
5. `storage_evidencias.sql`
6. `alerta_manual.sql`
7. `perfil_distrito_y_preferencias.sql`

## Fase 1: esquema y datos iniciales (completada)

- 18 tablas en Postgres con claves foráneas e índices.
- Catálogos iniciales: roles, categorías de emergencia, niveles de riesgo, estados de reporte y de alerta, tipos de contacto, contactos de emergencia y guías de prevención.
- Los usuarios se guardan en `perfiles`, ligada a `auth.users`.

## Fase 2: autenticación y roles (completada)

- Registro e inicio de sesión con Supabase Auth.
- Al registrarse, un trigger crea el perfil siempre con el rol `CIUDADANO` y su fila de preferencias de notificación. El rol nunca se lee de lo que mande el cliente.
- El registro pide nombres, apellidos y un teléfono de 9 dígitos. El distrito es opcional.
- Los roles son `ADMINISTRADOR` y `CIUDADANO`. El primer administrador se promueve a mano con un `update` sobre `perfiles`.

## Fase 3: permisos con RLS (completada)

- El ciudadano ve y crea solo sus reportes y sus notificaciones.
- Alertas, prevención y contactos son de lectura pública.
- Solo el administrador verifica reportes, crea y gestiona alertas, y gestiona usuarios.
- Las funciones auxiliares de permisos están en el esquema `private`, que la API no expone.
- Los avisos de `get_advisors` están revisados. Los que quedan son las funciones RPC, que cualquier usuario con sesión puede llamar; cada una comprueba el rol por dentro.

## Fase 4: lógica de negocio (completada)

Las escrituras pasan por funciones SQL en vez de inserts directos:

- `crear_reporte`
- `verificar_reporte`
- `cambiar_estado_reporte`
- `crear_alerta_desde_reporte`
- `crear_alerta_manual`
- `cambiar_estado_alerta`
- `cambiar_estado_usuario`

Un trigger guarda el historial de estados de cada alerta. Al verificar un reporte y al publicar una alerta se crean notificaciones, respetando las preferencias de cada usuario. Cada acción importante deja una fila en `auditoria`.

## Fase 5: evidencias (completada)

- Bucket privado `evidencias`: imágenes JPEG, PNG o WebP de hasta 5 MB.
- Cada archivo va en una carpeta con el `uid` del usuario. El dueño y los administradores pueden verlo.
- `reportes.evidencia_url` guarda la ruta del archivo en el bucket.

## Fase 6: conexión con el frontend (completada)

- `supabase-js` con el cliente en `frontend/src/app/core/supabase/`.
- Tipos de las tablas en `core/models/` y consultas compartidas en `core/data/datos.service.ts`.
- `AuthService` usa Supabase Auth. Los servicios de alertas y del panel de administración leen y escriben en Supabase.
- En `frontend/src/environments/` solo van la URL del proyecto y la clave pública. La clave `service_role` no se guarda en el repositorio.

## Estado actual

Registro, inicio de sesión, creación de reportes con evidencia, verificación, creación de alertas, notificaciones y mapa funcionan contra Supabase. Se probaron con la API usando un ciudadano y un administrador de prueba, y los datos de esa prueba se borraron después.
