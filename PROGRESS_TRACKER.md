# Seguimiento y Estado del Proyecto AlertaSegura

> **INSTRUCCIÓN OBLIGATORIA PARA CUALQUIER IA O AGENTE**: Antes de analizar, modificar o proponer cambios en este repositorio, lee completo este archivo. Úsalo como fuente principal de contexto sobre la arquitectura, el estado del proyecto, las decisiones tomadas y las tareas pendientes. No solicites al usuario que repita este contexto si ya está documentado aquí.

> **MANTENIMIENTO DEL SEGUIMIENTO**: Después de completar una funcionalidad, corregir un problema relevante o tomar una decisión técnica importante, actualiza este archivo en la misma tarea. Documenta solo cambios importantes dentro del sistema; no registres cada ajuste menor de estilos, formato o archivos auxiliares. Mantén el estado real del proyecto y marca claramente lo completado, lo pendiente y cualquier bloqueo.

> **REGLA DE PRIORIDAD**: Si el código actual contradice este documento, verifica el código y actualiza el documento. Nunca inventes funcionalidades, pruebas o configuraciones que no hayan sido comprobadas.

## Información General
- **Ruta de Backend**: `<raiz-del-repositorio>/alertasegura`
- **Ruta de Frontend**: `<raiz-del-repositorio>/frontend`
- **Base de datos**: MySQL (`localhost:3306`, DB: `alertasegura`)

---

## 🟢 Lo que ya está completado (Listo)

### 1. Base de Datos
- Las 18 tablas están creadas (schema.sql).
- Datos semilla (catálogos, roles, usuario admin) insertados (data.sql).

### 2. Backend (Spring Boot)
- **Compilación**: Funciona perfectamente (Java 25, Spring Boot 4.1.1). Lombok configurado en `pom.xml` vía `maven-compiler-plugin`.
- **Conexión DB**: Configurada y probada. JPA usa `update` para tolerar ligeros desajustes.
- **Estructura Creada**: Entidades, Repositorios, DTOs, Servicios, Controladores, GlobalExceptionHandler.
- **Seguridad**: JWT completamente configurado. Endpoints protegidos según roles.
- **Pruebas Exitosas**: 
  - [x] Registro de usuario (POST `/api/auth/registro`) - Retorna HTTP 200.
  - [x] Inicio de sesión (POST `/api/auth/login`) - Retorna HTTP 200 y el JWT válido.

### 3. Frontend (Angular)
- Proyecto base de Angular creado en la carpeta `frontend/`.

---

## 🟡 Tareas Actuales / Siguientes Pasos (En Progreso / Pendiente)

**Objetivo Inmediato**: Construir las bases visuales y de autenticación del Frontend.

1. **Definir Arquitectura CSS y Estilos Base**:
   - [x] Crear el tema global oscuro y el diseño visual base en `styles.css`.
2. **Crear Servicios Angular**:
    - [x] `auth.service.ts` para conectar con la API de login.
3. **Crear Pantalla Login**:
    - [x] Programar el formulario reactivo del Login.
4. **Crear Vista Principal (Dashboard)**:
   - [x] Pantalla de inicio protegida con layout, barra lateral y mensaje de bienvenida.
5. **Crear vista pública de Inicio**:
    - [x] Landing inicial con estado del sistema, estadísticas, alertas recientes y proceso de atención.
    - [x] Footer global con Plataforma y Ciudadanos.
6. **Implementar Mapa de emergencias**:
   - [x] Vista `/mapa` con Leaflet y OpenStreetMap.
   - [x] Marcadores usando latitud y longitud de `GET /api/alertas`.
   - [x] Filtros por nivel de riesgo y ubicación del usuario.
    - [x] Navegación desde Inicio y Dashboard.
7. **Implementar registro de usuarios**:
   - [x] Formulario Angular conectado a `POST /api/auth/registro`.
   - [x] Validación de datos, confirmación de contraseña y manejo de errores.
   - [x] Ruta `/registro` y enlaces desde Login y header público.
   - [x] Teléfono obligatorio de 9 dígitos y contraseña con número y carácter especial.
   - [x] Advertencia controlada para correos ya registrados.

---

## 📋 Registro de Cambios Recientes (Changelog)
- **2026-09-26**: 
  - Se crearon los documentos de planificación y control de avance (`BACKEND_PLAN.md`, `FRONTEND_PLAN.md`, `PROGRESS_TRACKER.md`).
  - Se confirmó el registro y login en el backend solucionando problemas de conexión a MySQL y configurando JPA ddl-auto a 'update'.
  - Se implementó la base de autenticación Angular: `AuthService`, interceptor JWT, guard, login reactivo y dashboard protegido.
  - Se creó la vista pública inicial con contenido estático y navegación visual para los módulos futuros.
  - Se integró Tailwind CSS 4 y se actualizó la identidad visual a azul petróleo y rojo coral.
  - Se ajustó el login con recordar sesión, recuperación y registro informativos, y se reforzó la responsividad del dashboard y la claridad de la vista pública.
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
   - Se corrigió el arranque local de la base de datos: el servicio MySQL97 debe estar activo en el puerto 3306.
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
