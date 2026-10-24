# Seguimiento y Estado del Proyecto AlertaSegura

> **INSTRUCCIÓN OBLIGATORIA PARA CUALQUIER AGENTE O IA**: Antes de analizar, modificar o proponer cambios en este repositorio, es OBLIGATORIO leer y comprender completamente este archivo. Este documento es la fuente principal de contexto sobre la arquitectura, el estado del proyecto, las decisiones técnicas tomadas y las tareas pendientes. No solicites al usuario que repita este contexto si ya está documentado aquí.

> **Propósito**: Este tracker sirve para (a) mantener alineación entre todos los contribuyentes, (b) evitar trabajo duplicado o contradictorio, y (c) garantizar que cualquier cambio respete el diseño y estado actual del sistema.

> **Cómo usar este documento**:
> 1. **Léelo completo antes de cualquier intervención** - no asumas nada basándote en el nombre de archivos o convenciones externas.
> 2. Si el código actual contradice este documento, el documento tiene prioridad; verifica el código y actualiza este tracker.
> 3. No inventes funcionalidades, pruebas o configuraciones que no hayan sido comprobadas en el entorno actual.
> 4. Para commits, waits el visto bueno explícito del usuario antes de empujar a GitHub.
> 5. Después de completar una funcionalidad relevante, actualiza este archivo en la misma tarea. Documenta solo cambios importantes; no registres ajustes menores de estilos, formato o archivos auxiliares a menos que afecten la arquitectura.

> **Estado actual del proyecto**: Este es un sistema full-stack de seguridad ciudadana con backend Spring Boot completado y frontend Angular en fase avanzada. El backend (100%) y el frontend (~95%) están operacionales con todas las APIs conectadas.

---

## 📦 Estructura del Proyecto

### Backend (`/alertasegura`)
- **Estado**: 100% completado y compilando correctamente
- **Componentes principales**:
  - Base de datos MySQL con 18 tablas y datos semilla
  - Spring Boot 4.1.1 con Java 25
  - JPA/Hibernate configurado (`ddl-auto=none`, migraciones explícitas via schema.sql)
  - JWT authentication (provider + filter + security config)
  - Spring Security con roles (USER, ADMINISTRADOR)
  - CORS configurado globalmente
  - DTOs y ApiResponse estándar
  - 18 controladores REST en `/api/*`
  - GlobalExceptionHandler para errores controlados
  - Servicios de negocio: Auth, Reporte, Alerta, Notificaciones, Contactos, Prevención
  - Manejo de validaciones personalizadas

### Frontend (`/frontend`)
- **Estado**: Avanzado (~95% completado, funcionalidades core operativas)
- **Arquitectura Angular 22** con componentes standalone
- **Rutas principales** (`app.routes.ts`):
  - `/` / `/inicio` - Página pública principal (Home)
  - `/login` - Pantalla de autenticación
  - `/registro` - Registro de nuevos usuarios
  - `/dashboard` - Panel de control protegido (requiere authGuard)
  - `/mapa` - Mapa geolocalizado con Leaflet
  - `/prevencion` - Información preventiva por categoría
  - `/contactos` - Contactos de emergencia
- **Componentes clave**:
  - `App` - Componente raíz con header/footer dinámico
  - `SiteHeader` / `SiteFooter` - Compartidos en todas las rutas
  - `Home` - Landing pública con hero, estadísticas, alertas, proceso
  - `Dashboard` - Panel ejecutivo con métricas, paneles laterales
  - `Map` - Leaflet + OpenStreetMap con filtros y marcadores
  - `Login` / `Register` - Formularios reactivos con validación
  - `Contacts` / `Prevention` - Vistas de catálogo estático

### Base de Datos (`/database`)
- `schema.sql` - Estructura de 18 tablas (solo lectura en producción)
- `data.sql` - Datos semilla iniciales (catálogos, roles, usuarios)
- Configuración por defecto: localhost:3306, DB `alertasegura`, usuario root

---

## 🟢 Lo que ya está completado (Listo)

### 1. Base de Datos ✅
- 18 tablas creadas en `schema.sql`
- Datos semilla insertados en `data.sql` (catálogos, 3 usuarios, roles)
- Configuración JPA: `ddl-auto=none` (migraciones explícitas obligatorias)

### 2. Backend (Spring Boot) ✅
- **Compilación**: Java 25, Spring Boot 4.1.1, Lombok configurado
- **Conexión DB**: Probada y funcional
- **Estructura completa**: Entidades, Repositorios, DTOs, Servicios, Controladores
- **Seguridad**: JWT totalmente configurado con refresh/access tokens
- **Endpoints principales** (todos probados):
  - `POST /api/auth/login` - Login con JWT válido
  - `POST /api/auth/registro` - Registro usuario con validaciones
  - `GET /api/alertas` - Alertas públicas (filtradas por estado)
  - `POST /api/reportes` - Crear reporte ciudadano
  - `GET /api/reportes/mis-reportes` - Reportes del usuario autenticado
  - `GET /api/contactos-emergencia` - Catálogo teléfonos emergencia
  - `GET /api/informacion-prevencion` - Guías preventivas
- **Seguridad**: Endpoints protegidos según roles, públicos vs privados
- **Manejo de errores**: GlobalExceptionHandler con ApiResponse

### 3. Frontend (Angular) ✅
- **Proyecto base** creado con Angular CLI
- **Autenticación completa**: AuthService, HttpInterceptor, AuthGuard
- **Rutas y navegación**: Todas las rutas implementadas con lazy loading
- **Página pública (Home/Landing)**: Hero section, estadísticas, alertas recientes, tipos de emergencia, proceso "Reporta/Verificamos/Informamos", footer global
- **Dashboard protegido**: Layout con header, métricas en tiempo real, 3 paneles (alertas cercanas, mis reportes, notificaciones), botón Cerrar sesión
- **Mapa interactivo**: Leaflet + OpenStreetMap, marcadores con popups, filtros por riesgo/tipo, ubicación del usuario
- **Contactos de Emergencia**: Consumo de API con tarjetas y botón de llamada
- **Prevención**: Vistas before/during/after por categoría de emergencia
- **Header y Footer**: Componen compartidos en todas las rutas
- **Validaciones de formulario**: Teléfono 9 dígitos, contraseña con requisitos, correo único

---

## 🟡 Áreas en Desarrollo / Pendientes Críticos

### Pending (bajas prioridad - sistema funcional)
1. **Optimización de rendimiento** - Memoización en servicios, change detection strategies
2. **Tests unitarios** - Cobertura de pruebas para servicios y componentes críticos
3. **Internationalización** - Soporte para múltiples idiomas beyond el español actual
4. **Modo reducido de movimiento** - Revisar todas las animaciones con `prefers-reduced-motion`
5. **Accessibility audit** - Verificación completa WCAG para componentes críticos
6. **Error handling frontend** - Mejora en mensajes de error del HttpInterceptor
7. **Lazy loading refinamiento** - Algunos módulos podrían cargarse bajo demanda

### 🆕 Nuevas Funcionalidades Agregadas

- **Módulo Reportar**: Formulario para crear reportes de emergencia con validación de campos obligatorios (título, descripción, categoría, dirección), campos opcionales (ubicación lat/long) y selector de nivel de riesgo. El formulario envía los datos a `POST /api/reportes` y muestra estados de carga, éxito y error. Ubicada en la ruta `/reportar`, entre el módulo de Mapa y el de Prevención en la navegación. Implementado con Angular standalone components, Signals para estado y validación reactiva con ngModel.

- **Navegación principal**: Agregado enlace "Reportar" en el header global (SiteHeader) en la sección de nav-links, ubicado entre los enlaces de Mapa y Prevención, para acceso rápido desde cualquier página del sistema.

- **Footer**: Enlace "Reportar emergencia" en la sección de Ciudadanos del footer ahora apunta directamente a la ruta `/reportar`, mejorando la usabilidad y consistencia con el resto de navegación.

---

## 📋 Registro de Cambios Recientes (Changelog)

- **2026-09-26**: 
  - Se crearon los documentos de planificación y control de avance (`BACKEND_PLAN.md`, `FRONTEND_PLAN.md`, `PROGRESS_TRACKER.md`).
  - Se confirmó el registro y login en el backend solucionando problemas de conexión a MySQL y configurando JPA ddl-auto a 'update'.
  - Se implementó la base de autenticación Angular: `AuthService`, interceptor JWT, guard, login reactivo y dashboard protegido.
  - Se creó la vista pública inicial con contenido estático y navegación visual para los módulos futuros.
  - Se integró Tailwind CSS 4 y se actualizó la identidad visual a azul petróleo y rojo coral.
  - Se ajustó el login con recordar sesión y registro informativos, y se reforzó la responsividad del dashboard y la claridad de la vista pública.
  - Se actualizó la identidad del login con el nombre AlertaSegura y la paleta azul petróleo/coral.
  - Se amplió el dashboard autenticado con estado del sistema, estadísticas, categorías, alertas recientes y flujo de atención; los datos son actualmente estáticos.
  - Se actualizó la barra lateral con los nombres definidos para cada ventana de la plataforma.
  - Se reorganizó Inicio con el mensaje "Mantente informado. Actúa a tiempo.", su descripción y cuatro tarjetas de tipos de alerta en el bloque principal.
  - Se reorganizó Inicio en hero azul, últimas alertas sobre fondo blanco, tarjetas de emergencias y sección final "¿Cómo funciona AlertaSegura?".
  - Se ajustó el login para ocupar el alto visible del escritorio sin desplazamiento vertical; en móvil conserva scroll cuando el contenido lo requiere.
  - Se mejoró la tipografía y el espaciado de Inicio, se añadió hover accesible a las tarjetas de emergencias y se rediseñó el proceso horizontal Reporta, Verificamos e Informamos.
  - Se reemplazó la sección de actividad por "Alertas recientes" con tarjetas rectangulares de tipo, descripción, lugar, riesgo, fecha, hora, estado y acceso visual a "Ver detalles".
  - Se separó visualmente el título de alertas y se organizaron las alertas recientes en tarjetas con cabeceras por riesgo: alto coral, moderado ámbar y bajo azul.
  - Se incorporó la paleta Indigo Ink completa como base del frontend, manteniendo el rojo coral para acciones y niveles de riesgo.
   - Se añadió el subtítulo de emergencias verificadas, bordes visibles y hover animado para alertas y tipos de emergencia.
   - Se añadió un footer global responsive con los apartados Plataforma y Ciudadanos.
   - Se implementó el mapa geolocalizado con Leaflet, OpenStreetMap, marcadores de alertas y filtros por riesgo.
   - Se habilitó la consulta pública de `/api/alertas` para alimentar el mapa.
   - Se corrigió el arranque local de la base de datos: el servicio MySQL debe estar activo en el puerto 3306.
   - Se unificó el header global para Inicio, Login, Dashboard y Mapa mediante un componente compartido.
   - Se eliminó la barra lateral duplicada del Dashboard para usar únicamente el header global.
   - Se ajustaron las acciones derechas del header global a `Iniciar sesión` y `Registrarse`.
   - Se reorganizó el Mapa para mostrar el mapa a la izquierda y las alertas activas a la derecha.
   - Se añadieron filtros por tres niveles de riesgo (alto, medio y bajo) y por tipo de desastre.
   - Se incorporaron indicadores de estado para alertas activas, en seguimiento y controladas.
   - Se restauró el catálogo original de diez categorías de emergencia y el filtro del mapa vuelve a reconocerlas.
   - Se corrigió el combo de tipos del mapa para mostrar siempre las diez categorías, incluso cuando no existen alertas activas.
   - Se conectó el header al estado de autenticación: después del login muestra el perfil y lo enlaza al Dashboard.
   - Se reorganizó el Dashboard con bienvenida, cuatro métricas y tres paneles: alertas cercanas, mis reportes y notificaciones.
     - Se añadió el botón `Cerrar sesión` en el Dashboard conectado al cierre de sesión JWT.
     - Se implementó el registro de usuarios ciudadanos desde la ruta `/registro`, conectado al endpoint de autenticación del backend.
     - Se reforzaron las reglas de registro: teléfono obligatorio de 9 dígitos, contraseña con número y carácter especial, y respuesta HTTP controlada para correos duplicados.
- **2026-09-30**:
  - Se creó el formulario vertical de registro de usuarios con nombres, apellidos, correo electrónico, teléfono, contraseña y confirmación de contraseña.
  - Se conectó el formulario con `POST /api/auth/registro` y se añadieron la ruta `/registro`, el enlace desde Login y el enlace desde el header público.
  - Se configuró la pantalla de registro con fondo blanco y sin header ni footer.
  - Se añadió la confirmación visual `Registro exitoso` y el botón `Ir al inicio de sesión` después de crear la cuenta.
  - Se estableció el teléfono como obligatorio y limitado a exactamente 9 dígitos.
  - Se estableció que la contraseña debe tener mínimo 6 caracteres, un número y un carácter especial.
  - Se renombró el último campo como `Confirmar contraseña` y se mantuvo la validación de coincidencia.
  - Se añadió la advertencia `El correo ya está registrado` al intentar crear una cuenta con un correo existente.
   - Se corrigió la actualización inmediata de los estados de carga, error y confirmación mediante signals de Angular.
- **2026-10-02**:
  - Se protegieron los listados y detalles administrativos de reportes y verificaciones con el rol `ADMINISTRADOR`; los reportes propios se mantienen disponibles mediante `/api/reportes/mis-reportes`.
  - Se restringió el acceso público de alertas a solicitudes `GET` y se limitaron las alertas visibles a los estados `ACTIVA`, `EN_SEGUIMIENTO` y `CONTROLADA`.
  - Se eliminaron secretos del archivo de configuración versionado: credenciales de MySQL y la clave JWT ahora se leen desde variables de entorno (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`).
  - Se desactivó la modificación automática del esquema mediante Hibernate (`ddl-auto=none`); el esquema debe gestionarse con `database/schema.sql` y migraciones explícitas.
  - Se endurecieron validaciones de radio de notificaciones, descripción, dirección, referencia y fecha de incidente, y se dejaron de devolver mensajes internos de excepciones al cliente.
  - Se añadió configuración de entornos para Angular, validación de expiración JWT, cierre de sesión ante respuestas `401`, limpieza del mapa Leaflet y sanitización de contenido mostrado en sus popups.
  - Se conectó el Dashboard con las APIs de alertas, reportes propios y notificaciones; dejó de mostrar métricas y registros ficticios.
  - Se corrigieron el idioma y título del documento HTML, y el login dejó de mostrar el header y footer globales.
  - Se actualizó `database/data.sql` mediante una exportación de la base MySQL local del 2026-10-02. La base contenía 3 usuarios, los catálogos iniciales y no contenía alertas ni reportes.
  - Se añadieron las vistas públicas `/prevencion` (guías antes/durante/después por categoría) y `/contactos` (teléfonos de emergencia con botón de llamada), consumiendo `/api/informacion-prevencion` y `/api/contactos-emergencia` con su envoltorio `ApiResponse`.
  - Se conectaron los enlaces de Prevención y Contactos del header y del footer a sus rutas reales.
  - Se rediseñó el formulario de registro con tarjeta centrada, cabecera de marca, casilla de términos y botón primario; se conservó el campo `Apellidos` obligatorio que exige el backend.
- **2026-10-21**:
  - Se corrigió CORS en la cadena de Spring Security (`CorsConfigurationSource` + `cors(withDefaults())`), evitando que las peticiones autenticadas con preflight (`Authorization`/JSON) fueran rechazadas con 401.
  - Se corrigieron errores de carga diferida (`LazyInitializationException`) en reportes, verificaciones, notificaciones y preferencias añadiendo límites transaccionales explícitos, dado que `spring.jpa.open-in-view=false`.
  - Se corrigió el manejo de errores: las validaciones ya no devuelven `success=true`, los correos duplicados responden 409, los accesos denegados responden 403 y los errores inesperados se registran en el log.
  - Se normalizaron los correos (trim + minúsculas) en login y registro, y se añadió detección de duplicados sin distinguir mayúsculas.
  - Se corrigió la creación de reportes: validación obligatoria en el componente (Angular ignora `required` por `novalidate`), coordenadas editables manualmente y fecha de incidente delegada al backend para evitar desfases de zona horaria.
  - Se implementó la subida real de evidencia fotográfica (`POST /api/reportes/{id}/evidencia`), almacenamiento local en `uploads/`, servido público en `/uploads/**` y límite de 5 MB para JPEG/PNG/WebP.
  - Se corrigió la sesión JWT: decodificación Base64URL robusta, no se adjunta el token a `/api/auth/**` y un 401 de login ya no provoca cierre de sesión/redirección.
  - Se corrigió el mapa: categorías derivadas de las alertas reales (sin ocultar categorías nuevas), marcador GPS único por usuario y mensaje de error de geolocalización independiente del error de carga de alertas.
  - Se detectó y corrigió la causa raíz del error 409 al crear reportes: la base local tenía `ubicaciones.departamento`, `provincia` y `distrito` como `NOT NULL`, mientras que `database/schema.sql` y el DTO los definen opcionales. Se añadió la migración `database/migrations/2026-10-21_ubicaciones_campos_opcionales.sql` y se aplicó a la base local.
  - Se completó el manejo de errores HTTP: 401 con cuerpo `ApiResponse`, 404 para recursos inexistentes, 405 para métodos no permitidos y 400 para parámetros de ruta inválidos.
  - Se verificó el flujo completo contra MySQL local: registro, login con correo en mayúsculas, creación de reporte, consulta de reportes propios, subida y lectura de evidencia, permisos 403 por propietario, notificaciones y duplicado 409. Los datos de prueba se eliminaron al finalizar.
  - Verificación final: `.\mvnw.cmd -o -q compile`, `.\mvnw.cmd -o -q test-compile` y `npm run build` finalizaron correctamente.
  - **Causa raíz de "tras el login no entra al sistema"**: `AuthService.isTokenExpired()` hacía doble decodificación del payload JWT (`JSON.parse(atob(decodeBase64Url(...)))`), cuando `decodeBase64Url` ya devuelve el JSON legible. `atob` sobre texto plano falla siempre, el `catch` devolvía `true` (token expirado), el `authGuard` borraba la sesión y redirigía a `/login`. Corregido eliminando el `atob` redundante; además el login navega a `/dashboard` tras guardar la sesión.
  - Verificación end-to-end con navegador real (Chrome headless + DevTools Protocol) contra `ng serve` y MySQL local: login por formulario → `PUSH /dashboard` → sesión persistente → `/api/alertas`, `/api/reportes/mis-reportes` y `/api/notificaciones` responden 200.

---
