# AlertaSegura

AlertaSegura es una plataforma web de seguridad ciudadana para consultar emergencias, visualizar alertas geolocalizadas, registrar reportes y compartir información preventiva. Su objetivo es ayudar a la comunidad a recibir información oportuna y actuar a tiempo.

## Funcionalidades

- Inicio público con información general y alertas recientes.
- Inicio de sesión con autenticación JWT.
- Dashboard ciudadano con actividad, reportes y notificaciones.
- Mapa geolocalizado de emergencias con Leaflet y OpenStreetMap.
- Filtros de alertas por nivel de riesgo y tipo de emergencia.
- Marcadores con ubicación, categoría y estado de cada alerta.
- Registro de reportes ciudadanos con coordenadas.
- Catálogo de prevención y contactos de emergencia.
- Header y footer compartidos en todas las páginas.

## Tecnologías

- Frontend: Angular 22, TypeScript, Tailwind CSS y Leaflet.
- Backend: Java 25, Spring Boot 4.1.1, Spring Security y JWT.
- Base de datos: MySQL 8+.
- Mapas: OpenStreetMap mediante Leaflet.

## Estructura

```text
alertasegura/
├── alertasegura/       # Backend Spring Boot
├── frontend/            # Aplicación Angular
├── database/
│   ├── schema.sql       # Estructura de la base de datos
│   └── data.sql         # Datos iniciales y catálogos
├── FRONTEND_PLAN.md
├── BACKEND_PLAN.md
└── PROGRESS_TRACKER.md  # Estado y seguimiento del proyecto
```

## Requisitos

- Java 25 o compatible con la configuración del proyecto.
- Node.js y npm.
- MySQL 8+ ejecutándose en el puerto `3306`.
- Base de datos `alertasegura` creada.

## Configuración de base de datos

La configuración local del backend se encuentra en:

```text
alertasegura/src/main/resources/application.properties
```

Por defecto utiliza:

```text
Host: localhost
Puerto: 3306
Base de datos: alertasegura
Usuario: root
```

Primero ejecuta `database/schema.sql` y después `database/data.sql` en MySQL.

## Ejecutar el backend

Desde la carpeta `alertasegura/`:

```bash
mvn spring-boot:run
```

El backend queda disponible en `http://localhost:8080`.

## Ejecutar el frontend

Desde la carpeta `frontend/`:

```bash
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200`.

## Endpoints principales

- `POST /api/auth/login`: iniciar sesión.
- `POST /api/auth/registro`: registrar usuario.
- `GET /api/alertas`: consultar alertas activas.
- `POST /api/reportes`: crear un reporte ciudadano.
- `GET /api/reportes/mis-reportes`: consultar los reportes del usuario autenticado.
- `GET /api/contactos-emergencia`: consultar contactos de emergencia.
- `GET /api/informacion-prevencion`: consultar información preventiva.

## Estado actual

La interfaz principal y el mapa ya están implementados. El Dashboard todavía contiene algunos datos de demostración que serán reemplazados progresivamente por información proveniente de la API. Las funcionalidades nuevas y decisiones importantes deben registrarse en `PROGRESS_TRACKER.md`.
