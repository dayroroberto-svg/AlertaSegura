# AlertaSegura

AlertaSegura es una plataforma web de seguridad ciudadana. Permite consultar emergencias, ver alertas en un mapa, enviar reportes y leer información preventiva, para que la comunidad se entere a tiempo y pueda actuar.

## Funcionalidades

- Inicio público con información general y alertas recientes.
- Registro e inicio de sesión con Supabase Auth. El administrador entra directo a su panel y el ciudadano a la página de inicio.
- Dashboard del ciudadano con sus reportes, las alertas y sus notificaciones.
- Lista de alertas con filtros por nivel de riesgo y tipo de emergencia, y una página de detalle para cada una.
- Mapa de emergencias con Leaflet y OpenStreetMap, con marcadores por ubicación, categoría y estado.
- Reportes ciudadanos con coordenadas y foto de evidencia.
- Información de prevención y contactos de emergencia.
- Panel de administración para verificar reportes, publicar y gestionar alertas, y activar o desactivar usuarios.

## Tecnologías

- Frontend: Angular 22, TypeScript, Tailwind CSS y Leaflet.
- Backend: Supabase (Postgres, Auth, Row Level Security, funciones SQL y Storage).
- Mapas: OpenStreetMap.

## Estructura

```text
AlertaSegura/
├── frontend/             # Aplicación Angular
├── supabase/             # Scripts SQL de la base de datos
├── FRONTEND_PLAN.md
├── BACKEND_PLAN.md
└── PROGRESS_TRACKER.md   # Estado y seguimiento del proyecto
```

Dentro de `frontend/src/app/`, `client/` tiene las páginas del ciudadano, `admin/` el panel de administración y `core/` el cliente de Supabase, los tipos y el servicio de datos.

## Requisitos

- Node.js y npm.
- Un proyecto de Supabase.

## Configurar Supabase

1. Crea un proyecto en Supabase.
2. En el SQL Editor, ejecuta en orden los scripts de `supabase/`: `esquema_inicial.sql`, `auth_y_rls.sql`, `logica_negocio.sql`, `ajustes_permisos.sql`, `storage_evidencias.sql`, `alerta_manual.sql` y `perfil_distrito_y_preferencias.sql`.
3. Copia la URL del proyecto y la clave pública (publishable o anon) en `frontend/src/environments/environment.ts` y `environment.prod.ts`. La clave `service_role` no debe guardarse en el repositorio.
4. En desarrollo conviene desactivar la confirmación por correo, en Authentication, Sign In / Providers, User Signups, Confirm email.

## Crear el primer administrador

Todos los usuarios nuevos entran como `CIUDADANO`. Para dar el rol de administrador, regístrate desde la aplicación y ejecuta en el SQL Editor:

```sql
update public.perfiles
set id_rol = (select id_rol from public.roles where nombre = 'ADMINISTRADOR')
where correo = 'tu-correo@ejemplo.com';
```

## Ejecutar el frontend

Desde la carpeta `frontend/`:

```bash
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200`.

## Acceso a datos

El frontend consulta las tablas con supabase-js, y las reglas de Row Level Security deciden qué ve cada usuario. Las escrituras importantes pasan por funciones SQL:

- `crear_reporte`: un ciudadano envía un reporte.
- `verificar_reporte` y `cambiar_estado_reporte`: el administrador revisa reportes.
- `crear_alerta_desde_reporte` y `crear_alerta_manual`: el administrador publica una alerta.
- `cambiar_estado_alerta`: el administrador actualiza una alerta.
- `cambiar_estado_usuario`: el administrador activa o desactiva una cuenta.

Las fotos de evidencia se guardan en el bucket privado `evidencias`, que acepta JPEG, PNG y WebP de hasta 5 MB.

## Estado actual

Las pantallas del ciudadano y el panel de administración están conectados a Supabase. Las decisiones y los cambios importantes se anotan en `PROGRESS_TRACKER.md`.
