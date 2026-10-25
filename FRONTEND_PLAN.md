# Plan del frontend de AlertaSegura

Este documento recoge el plan de implementación del frontend.

## Tecnologías

- Angular 22 con componentes standalone y signals
- Tailwind CSS 4 con HTML y CSS de componente (estilo editorial y responsive)
- TypeScript
- Leaflet y OpenStreetMap para los mapas
- supabase-js para hablar con Supabase

## Organización del código

- `src/app/client/`: páginas del ciudadano (inicio, alertas, mapa, reportar, prevención, contactos, dashboard, login y registro).
- `src/app/admin/`: panel de administración con su propio layout, sin el header ni el footer públicos.
- `src/app/core/`: cliente de Supabase, tipos de las tablas y el servicio de datos que comparten las pantallas.

## Fases del proyecto

### Fase 10: inicialización (completada)
- [x] Proyecto base con Angular CLI.
- [x] Enrutamiento básico en `app.routes.ts`.

### Fase 11: base de UI y estilos globales (completada)
- [x] Paleta de colores en `styles.css`.
- [x] Tipografía (Manrope y DM Mono).
- [x] Estilos base de la interfaz.

### Fase 12: servicios y seguridad (completada)
- [x] `AuthService` conectado a Supabase Auth, con la sesión restaurada al arrancar la app.
- [x] `authGuard` para las rutas privadas y `adminGuard` para el panel, que exige el rol `ADMINISTRADOR`.

### Fase 13: autenticación (completada)
- [x] Login con formularios reactivos y validación.
- [x] Tras iniciar sesión, el administrador va a `/admin` y el ciudadano a `/inicio`.
- [x] Opción de recordar sesión y estados visuales en el registro.

### Fase 14: vista principal y dashboard (completada)
- [x] Header global con los datos del usuario que inició sesión.
- [x] Tablero con métricas, alertas cercanas, mis reportes y notificaciones.
- [x] Adaptación responsive para navegación y acciones en móvil.

### Fase 15: módulos del ciudadano (completada)
- [x] Reportar: formulario con ubicación, nivel de riesgo y foto de evidencia, más la pantalla de confirmación.
- [x] Alertas: lista con filtros por riesgo y tipo, y detalle de cada alerta.
- [x] Mapa de emergencias con filtros.
- [x] Contactos de emergencia e información de prevención.

### Fase 16: panel de administración (completada)
- [x] Dashboard con estadísticas calculadas desde la base de datos.
- [x] Lista y detalle de reportes, con verificación o rechazo y comentario.
- [x] Creación de alertas, desde un reporte verificado o sin reporte previo, y pantalla de confirmación.
- [x] Gestión de alertas (activa, finalizada, archivada).
- [x] Usuarios, con activar y desactivar.
- [x] Mapa y configuración.

### Vista pública de inicio (completada)
- [x] Presentación con estado del sistema y alertas recientes.
- [x] Estadísticas, categorías de emergencia y explicación del proceso reportar, verificar e informar.

## Notas de diseño

El diseño busca destacar desde el primer vistazo. Tailwind se usa junto con CSS de componente cuando hace falta. Los estados de carga y las animaciones sutiles son parte de la experiencia.

### Interacción y movimiento
- [x] Estados de foco, presión y hover con curvas y propiedades específicas.
- [x] Soporte de `prefers-reduced-motion` en login, inicio y dashboard.
- [ ] Revisar las animaciones existentes antes de cerrar una tarea que incluya movimiento.
- [ ] Cuidar la accesibilidad y el diseño responsive en cada interacción animada.

### Identidad visual
- Tailwind CSS está configurado mediante PostCSS.
- Paleta principal: Indigo Ink `#4329d6`, con escalas de `#eceafb` a `#09061e`, y rojo coral `#d56b5b` para acciones y riesgo.
- No se usan azul puro ni rojo puro. Los colores se reservan para jerarquía, riesgo y acciones.
