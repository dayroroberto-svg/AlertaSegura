# Seguimiento del proyecto AlertaSegura

Este archivo es la referencia principal del proyecto: cómo está armado, qué está hecho y qué falta. Quien vaya a tocar el repositorio (persona o agente) debe leerlo completo antes de empezar, para no repetir trabajo ni contradecir decisiones ya tomadas.

Cómo usarlo:

1. Léelo entero antes de cambiar nada. No supongas el estado del proyecto por el nombre de los archivos.
2. Si el código contradice este documento, revisa el código y corrige el documento.
3. No documentes funcionalidades, pruebas ni configuraciones que no se hayan comprobado.
4. Antes de hacer commit o push, espera el visto bueno del usuario.
5. Al terminar una funcionalidad importante, actualiza este archivo en la misma tarea. Los ajustes menores de estilos o formato no hace falta anotarlos.

Estado actual: AlertaSegura es una plataforma de seguridad ciudadana con frontend Angular y backend en Supabase. Las pantallas del ciudadano y el panel de administración están conectados a Supabase.

---

## Estructura del proyecto

### Backend en Supabase (`/supabase`)

- Postgres con 18 tablas y los catálogos iniciales cargados.
- Supabase Auth para el registro y el inicio de sesión. Cada cuenta tiene un perfil en `perfiles` con rol `ADMINISTRADOR` o `CIUDADANO`.
- Row Level Security: el ciudadano ve y crea solo sus reportes y notificaciones; alertas, prevención y contactos son públicos; el administrador gestiona reportes, alertas y usuarios.
- Funciones SQL para las escrituras importantes: `crear_reporte`, `verificar_reporte`, `cambiar_estado_reporte`, `crear_alerta_desde_reporte`, `crear_alerta_manual`, `cambiar_estado_alerta` y `cambiar_estado_usuario`.
- Triggers para crear el perfil al registrarse y para guardar el historial de estados de las alertas.
- Bucket privado `evidencias` para las fotos de los reportes: JPEG, PNG o WebP de hasta 5 MB.
- Los scripts SQL están en `supabase/`. El orden para ejecutarlos está en `BACKEND_PLAN.md`.

### Frontend (`/frontend`)

- Angular 22 con componentes standalone.
- `src/app/client/`: páginas del ciudadano.
- `src/app/admin/`: panel de administración, con layout propio y protegido por `adminGuard`.
- `src/app/core/`: cliente de Supabase, tipos de las tablas y `DatosService`, con las consultas que comparten varias pantallas.
- Rutas del ciudadano:
  - `/` y `/inicio`: página pública principal.
  - `/login` y `/registro`: autenticación.
  - `/dashboard`: panel del ciudadano, protegido por `authGuard`.
  - `/alertas` y `/alertas/:id`: lista y detalle de alertas.
  - `/mapa`: mapa de emergencias con Leaflet.
  - `/reportar` y `/reporte-enviado`: envío de reportes y su confirmación.
  - `/prevencion` y `/contactos`: información preventiva y teléfonos de emergencia.
- Rutas del administrador, todas bajo `/admin`: `dashboard`, `reportes`, `reportes/:id`, `alertas`, `alertas/nueva`, `alertas/confirmacion/:id`, `usuarios`, `mapa` y `configuracion`.

---

## Lo que está hecho

### Base de datos y backend
- 18 tablas con claves foráneas e índices.
- Catálogos iniciales: roles, categorías de emergencia, niveles de riesgo, estados, tipos de contacto, contactos de emergencia y guías de prevención.
- Registro con nombres, apellidos, teléfono de 9 dígitos y distrito opcional. El rol del perfil siempre es `CIUDADANO`; el primer administrador se promueve a mano.
- Políticas de RLS y funciones SQL probadas con un ciudadano y un administrador de prueba.
- Los avisos de seguridad de Supabase están revisados. Los que quedan son las funciones RPC, que cualquier usuario con sesión puede llamar; cada una comprueba el rol por dentro.

### Frontend
- Proyecto base con Angular CLI, rutas con carga diferida y Tailwind CSS 4.
- Autenticación con Supabase Auth: `AuthService`, `authGuard`, `adminGuard`, login y registro con formularios reactivos.
- Al iniciar sesión, el administrador entra a `/admin` y el ciudadano a `/inicio`. El perfil del header lleva a cada uno a su panel.
- Las rutas de login, registro, dashboard y reportar se cargan bajo demanda; el bundle inicial mide unos 548 kB.
- Inicio público con hero, estadísticas, alertas recientes, tipos de emergencia y el proceso Reporta, Verificamos e Informamos.
- Dashboard del ciudadano con métricas, alertas, sus reportes y sus notificaciones.
- Lista y detalle de alertas, con filtros por riesgo y tipo.
- Mapa con Leaflet y OpenStreetMap: marcadores, filtros por riesgo y tipo, y ubicación del usuario.
- Reportar: formulario con ubicación marcada en un mapa (o detectada con el GPS), nivel de riesgo y foto de evidencia, y pantalla de confirmación.
- Prevención (antes, durante y después por categoría) y contactos de emergencia con botón de llamada.
- Panel de administración completo: dashboard, reportes, verificación o rechazo con comentario, creación de alertas, gestión de alertas, usuarios, mapa y configuración.
- Header y footer compartidos en todas las páginas públicas.
- Validaciones de formulario: teléfono de 9 dígitos y contraseña con al menos 6 caracteres, un número y un carácter especial.

---

## Pendiente

Nada bloquea el uso del sistema. Queda por hacer:

1. Los interruptores de notificaciones del administrador se guardan, pero todavía no envían nada: no hay avisos por correo ni resúmenes diarios.
2. Tests unitarios de servicios y componentes importantes.
3. Soporte para otros idiomas, además del español.
4. Revisar todas las animaciones con `prefers-reduced-motion`.
5. Auditoría de accesibilidad (WCAG) de los componentes principales.

---

## Registro de cambios

### 2026-09-26
- Se crearon los documentos de planificación y seguimiento (`BACKEND_PLAN.md`, `FRONTEND_PLAN.md` y este archivo).
- Se armó la base de autenticación de Angular: `AuthService`, guard, login reactivo y dashboard protegido.
- Se integró Tailwind CSS 4 y se definió la identidad visual con la paleta Indigo Ink y rojo coral.
- Se creó la vista pública de inicio: mensaje "Mantente informado. Actúa a tiempo.", tarjetas de tipos de alerta, alertas recientes con cabeceras por riesgo (alto coral, moderado ámbar, bajo azul), tarjetas de emergencias con hover y la sección "¿Cómo funciona AlertaSegura?".
- Se añadió el footer global con los apartados Plataforma y Ciudadanos, y se unificó el header en un componente compartido. Después del login, el header muestra el perfil y lo enlaza al dashboard.
- Se ajustó el login para que ocupe el alto visible del escritorio, con la opción de recordar sesión.
- Se implementó el mapa con Leaflet y OpenStreetMap, con marcadores de alertas, filtros por tres niveles de riesgo (alto, medio y bajo) y por tipo de desastre, e indicadores de estado (activa, en seguimiento y controlada). El combo de tipos muestra siempre las diez categorías.
- Se reorganizó el dashboard con bienvenida, cuatro métricas y tres paneles: alertas cercanas, mis reportes y notificaciones. Incluye el botón "Cerrar sesión".
- Se creó el registro de usuarios con las reglas de teléfono y contraseña.
- Se creó el proyecto de Supabase con las 18 tablas y los catálogos iniciales (roles, categorías de emergencia, niveles de riesgo, estados, contactos y guías de prevención).
- Se configuró Supabase Auth con un perfil por cuenta y los roles `ADMINISTRADOR` y `CIUDADANO`.

### 2026-09-30
- Formulario de registro vertical con nombres, apellidos, correo, teléfono, contraseña y confirmación, en la ruta `/registro` y con enlaces desde el login y el header público. Se muestra "Registro exitoso" con el botón "Ir al inicio de sesión".
- Se añadió la advertencia "El correo ya está registrado" para correos repetidos.
- Se corrigió la actualización de los estados de carga, error y confirmación usando signals.
- El registro se conectó a Supabase Auth: un trigger crea el perfil siempre como `CIUDADANO` y su fila de preferencias de notificación.

### 2026-10-02
- El dashboard dejó de mostrar métricas y registros ficticios y usa datos reales.
- Se añadieron las vistas `/prevencion` y `/contactos`, y se enlazaron desde el header y el footer.
- Se rediseñó el registro con tarjeta centrada, cabecera de marca y casilla de términos.
- Se añadió configuración de entornos para Angular, se limpia el mapa de Leaflet al salir y se sanitiza el contenido de sus popups.
- Se corrigieron el idioma y el título del documento HTML, y el login dejó de mostrar el header y el footer globales.
- Se definieron las políticas de RLS: el ciudadano ve y crea solo sus reportes y notificaciones, alertas, prevención y contactos son públicos y el administrador gestiona reportes, alertas y usuarios.
- Se añadió la capa de datos de Angular: `supabase-js`, `core/supabase`, `core/models` y `core/data/datos.service.ts`. `AuthService`, el dashboard, el mapa, prevención y contactos leen de Supabase.

### 2026-10-21
- Reportar: el componente valida los campos obligatorios, las coordenadas se pueden editar a mano y la fecha del incidente se envía sin desfases de zona horaria.
- Mapa: las categorías salen de las alertas reales, hay un solo marcador de GPS por usuario y el error de geolocalización es independiente del error de carga.
- Funciones SQL para las escrituras: crear reporte, verificar o rechazar, cambiar estados, crear alertas y activar o desactivar usuarios. Un trigger guarda el historial de estados de las alertas y se crean notificaciones según las preferencias de cada usuario.
- Bucket privado `evidencias` para las fotos de los reportes (JPEG, PNG o WebP, hasta 5 MB). En Reportar, la foto se sube antes de crear el reporte; si la subida falla, el reporte se envía igual y la confirmación lo avisa.
- Nuevas pantallas del ciudadano: lista y detalle de alertas (`/alertas`, `/alertas/:id`) y confirmación de reporte (`/reporte-enviado`).
- Panel de administración en `/admin`, con layout propio, `adminGuard` y nueve pantallas. Todo su acceso a datos está en `admin-data.service.ts`.
- Al iniciar sesión, el administrador entra a `/admin` y el ciudadano a `/inicio`.
- Se añadió el distrito opcional al registro y se muestra en la tabla de usuarios del administrador.
- En Reportar se puede marcar el punto exacto en un mapa de Leaflet, y arrastrar el marcador para ajustarlo. Si no se escribe una dirección, se guarda el punto con sus coordenadas.
- El mapa del panel de administración ahora es un mapa real de Leaflet con las alertas en su ubicación, en lugar de una imagen ilustrativa. Solo aparecen las alertas que tienen coordenadas.
- El detalle de un reporte en el panel de administración muestra su ubicación en un mapa y la foto que adjuntó el ciudadano, abierta con un enlace temporal porque el bucket es privado. Si no hay foto, lo indica.
- La app no usa zone.js, así que las pantallas que guardan datos en propiedades normales deben avisar a Angular con `markForCheck()`. Se corrigió en el dashboard del ciudadano, que mostraba sus reportes en 0, y en el error de envío de Reportar.
- Los interruptores de notificaciones de la configuración del administrador se guardan en su perfil.
- Las cifras de Inicio y Login (alertas activas, reportes recibidos, emergencias verificadas y distritos con alertas) salen de la base de datos mediante la función `estadisticas_publicas`, que solo devuelve totales.
- Al marcar el punto en Reportar, OpenStreetMap lo convierte en calle y distrito, y el reporte los guarda. Si no responde, se guardan las coordenadas.
- El pie de página queda pegado al fondo de la ventana en las páginas con poco contenido.
- Páginas de Soporte: `/ayuda`, `/terminos`, `/privacidad` y `/accesibilidad`, enlazadas desde el footer y desde el registro (se abren en otra pestaña para no perder el formulario).
- Los números de emergencia de Reportar y del detalle de alerta coinciden con la tabla de contactos: 105 Policía, 116 Bomberos, 106 SAMU y 115 INDECI.
- La campana del panel de administración muestra cuántos reportes esperan revisión y lleva a la lista de reportes.
- Las fotos de los reportes se revisan con IA: la Edge Function `analizar-evidencia` le pregunta a Gemini si la foto corresponde a la emergencia declarada o parece una broma. El administrador ve el veredicto, la confianza y el motivo en el detalle del reporte, y puede pedir la revisión otra vez. Es solo un aviso; la decisión sigue siendo del administrador.
- Las rutas de login, registro, dashboard y reportar se cargan bajo demanda, y el aviso del bundle inicial pasó a 600 kB.
- Se probó el flujo completo contra Supabase con un ciudadano y un administrador de prueba. Los datos de esa prueba se borraron al terminar.

---
