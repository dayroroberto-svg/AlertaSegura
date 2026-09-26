# Seguimiento y Estado del Proyecto AlertaSegura
> **NOTA PARA LA IA**: Lee este archivo AL INICIAR cualquier sesión o tarea para conocer el estado actual del proyecto, y actualízalo inmediatamente después de completar cada funcionalidad importante.

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
   - [x] Módulos futuros visibles como accesos inactivos, sin navegación implementada.

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
