# Plan del Frontend: AlertaSegura (En Progreso)

Este documento detalla el plan de implementación del Frontend para el sistema AlertaSegura.

## Tecnologías a Utilizar
- Angular 17+ (Standalone Components)
- Tailwind CSS 4 + HTML5/CSS3 (estilo visual editorial y responsive)
- TypeScript

## Fases del Proyecto

### Fase 10: Inicialización (Completado)
- [x] Generación del proyecto base con Angular CLI (`npx @angular/cli new frontend`).
- [x] Configuración de enrutamiento básico (`app.routes.ts`).

### Fase 11: Base de UI y Estilos Globales (Pendiente)
- [x] Definición de paleta de colores en `styles.css` (Dark Theme, Acentos Cian/Esmeralda).
- [x] Importación de tipografía (Manrope/DM Mono).
- [x] Creación de estilos base para la interfaz.

### Fase 12: Capa de Servicios y Seguridad (Pendiente)
- [x] Creación de `AuthService` para consumir `/api/auth/login`.
- [x] Implementación de un `HttpInterceptor` para adjuntar el JWT Token en cada petición.
- [x] Creación de `AuthGuard` para proteger rutas privadas.

### Fase 13: Módulo de Autenticación (Pendiente)
- [x] Componente de Login (UI moderna, validación de formularios reactivos).
- [x] Redirección tras un login exitoso al Dashboard.
- [x] Opción de recordar sesión y estados visuales para el registro.

### Fase 14: Vista Principal / Dashboard (Pendiente)
- [x] Layout principal con Barra Lateral de navegación (Sidebar).
- [x] Cabecera con datos del usuario logueado.
- [x] Tablero de bienvenida con estadísticas básicas.
- [x] Adaptación responsive para navegación y acciones en móvil.
- [x] Resumen de categorías, alertas recientes y proceso de atención.

### Fase 15: Módulos de Operación (Pendiente)
- [ ] Módulo de Reportes: Vista para listar y crear reportes (integración con mapas opcional).
- [ ] Módulo de Alertas Públicas.
- [ ] Directorio de Contactos de Emergencia e Información de Prevención.

### Vista pública de Inicio (Completado)
- [x] Presentación principal con estado del sistema y alertas activas.
- [x] Estadísticas generales, categorías de emergencia y alertas recientes.
- [x] Explicación visual del proceso reportar, verificar e informar.
- [x] Accesos visuales preparados sin activar navegación a módulos pendientes.

## Notas de Diseño
El diseño deberá destacar desde el primer vistazo. Tailwind se utilizará junto con CSS de componente cuando sea necesario. Animaciones sutiles y estados de carga (loaders) son requeridos para una experiencia "Premium".

### Skills de diseño del proyecto
- [x] Revisar automáticamente `.agents/skills/` antes de iniciar tareas de frontend.
- [x] Aplicar `emil-design-eng` para decisiones de composición, detalle visual, estados y calidad de interfaz.
- [x] Aplicar estados de foco, presión y hover con curvas y propiedades específicas.
- [x] Añadir soporte `prefers-reduced-motion` a las interacciones del login, Inicio y dashboard.
- [ ] Aplicar `animate` únicamente cuando se soliciten animaciones o transiciones nuevas.
- [ ] Revisar animaciones existentes con `review-animations` antes de cerrar una tarea que incluya movimiento.
- [ ] Usar `find-animation-opportunities` o `improve-animations` solo para auditorías específicas de motion.
- [ ] Mantener accesibilidad, responsive design y `prefers-reduced-motion` en cada interacción animada.

### Identidad visual actualizada
- Tailwind CSS está configurado mediante PostCSS.
- Paleta principal: Indigo Ink `#4329d6` con escalas de `#eceafb` a `#09061e`, y rojo coral `#d56b5b` para acciones y riesgo.
- No se utilizan azul puro ni rojo puro; los colores se reservan para jerarquía, riesgo y acciones.
