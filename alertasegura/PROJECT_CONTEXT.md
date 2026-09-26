Sí. Ahora que tengo **tu estructura real de base de datos**, hay que corregir el contexto anterior: tu BD usa **MySQL 8.0+**, y además tu modelo tiene una separación importante entre **reportes ciudadanos** y **alertas públicas**, junto con verificación, historial, notificaciones, prevención, contactos de emergencia y auditoría.

Te dejo un PROJECT\_CONTEXT.md completo, basado en tu estructura real.

# ALERTASEGURA - CONTEXTO Y ESTRUCTURA DEL SISTEMA

## 1. Información general

\*\*Nombre del proyecto:\*\* AlertaSegura

\*\*Tipo:\*\* Plataforma web de gestión y difusión de alertas de emergencias.

\*\*Ámbito inicial:\*\* Lima Este, Perú.

\*\*Base de datos:\*\* MySQL 8.0+

AlertaSegura es una plataforma web orientada al registro, gestión, verificación, publicación, seguimiento y consulta de información relacionada con emergencias y situaciones de riesgo.

El sistema permite que los ciudadanos registren reportes sobre incidentes. Estos reportes pueden ser revisados y verificados por usuarios con permisos administrativos. A partir de un reporte gestionado, se puede generar una alerta pública que será visible para los usuarios de la plataforma.

El sistema también permite:

- Visualizar alertas geolocalizadas.

- Gestionar estados de alertas.

- Mantener historial de cambios.

- Enviar notificaciones.

- Configurar preferencias de notificaciones.

- Consultar contactos de emergencia.

- Consultar información preventiva.

- Registrar acciones administrativas mediante auditoría.

---

# 2. Objetivo general

Desarrollar una plataforma web que permita registrar, gestionar, verificar, publicar y consultar información relacionada con emergencias, accidentes y situaciones de riesgo, utilizando información geolocalizada y mecanismos de notificación para facilitar el acceso oportuno a información de interés para los ciudadanos.

---

# 3. Problema

La información relacionada con emergencias puede encontrarse dispersa entre diferentes canales.

Esto puede dificultar que los ciudadanos conozcan rápidamente:

- Qué ocurrió.

- Dónde ocurrió.

- Qué nivel de riesgo presenta.

- Si el reporte fue verificado.

- Si existe una alerta pública.

- Cuál es el estado actual de una emergencia.

- Qué recomendaciones seguir.

- A qué servicio de emergencia acudir.

AlertaSegura busca centralizar esta información mediante una plataforma web.

---

# 4. Concepto principal del sistema

El flujo fundamental de AlertaSegura es:

\`\`\`text

CIUDADANO

|

v

REGISTRA REPORTE

|

v

REPORTE CIUDADANO

|

v

REVISIÓN / VERIFICACIÓN

|

+----> RECHAZADO

|

+----> VERIFICADO

|

v

ALERTA PÚBLICA

|

v

NOTIFICACIÓN A USUARIOS

|

v

CONSULTA / MAPA

|

v

SEGUIMIENTO

|

v

FINALIZACIÓN

La diferencia fundamental es:

**Reporte = información enviada por un ciudadano.**

**Alerta = información gestionada y publicada por el sistema para conocimiento público.**

**5. Actores**

**5.1 Ciudadano**

Puede:

- Registrarse.
- Iniciar sesión.
- Registrar reportes.
- Consultar alertas.
- Visualizar alertas en el mapa.
- Consultar información preventiva.
- Consultar contactos de emergencia.
- Recibir notificaciones.
- Configurar preferencias de notificaciones.

**5.2 Administrador**

Puede:

- Gestionar usuarios.
- Revisar reportes.
- Verificar reportes.
- Rechazar reportes.
- Crear y gestionar alertas públicas.
- Actualizar estados.
- Publicar información.
- Gestionar categorías.
- Gestionar contactos de emergencia.
- Gestionar información preventiva.
- Consultar acciones administrativas.

**5.3 Personal encargado**

El sistema puede utilizar roles para diferenciar usuarios administrativos y otros usuarios autorizados.

Las operaciones concretas dependen del rol asignado.

**6. Roles**

La tabla roles almacena los roles disponibles del sistema.

Estructura:

roles

├── id\_rol

├── nombre

└── descripcion

Cada usuario pertenece a un rol.

Relación:

ROL 1 ──────── N USUARIOS

**7. Usuarios**

La tabla usuarios contiene la información de los usuarios del sistema.

Campos principales:

usuarios

├── id\_usuario

├── id\_rol

├── nombres

├── apellidos

├── correo

├── contrasena

├── telefono

├── estado

├── fecha\_registro

└── ultima\_conexion

El estado puede ser:

ACTIVO

INACTIVO

BLOQUEADO

La contraseña debe almacenarse utilizando un mecanismo seguro de hash.

Nunca se debe almacenar una contraseña en texto plano.

**8. Ubicaciones**

La tabla ubicaciones almacena la información geográfica asociada a reportes y alertas.

Campos:

ubicaciones

├── id\_ubicacion

├── departamento

├── provincia

├── distrito

├── direccion

├── latitud

├── longitud

└── referencia

La ubicación es importante para la funcionalidad del mapa.

Las coordenadas principales son:

latitud

longitud

Estas coordenadas permiten representar una alerta sobre un mapa.

**9. Categorías de emergencia**

La tabla categorias\_emergencia contiene las categorías disponibles para clasificar reportes y alertas.

Campos:

categorias\_emergencia

├── id\_categoria

├── nombre

├── descripcion

├── icono

└── estado

El estado puede ser:

ACTIVO

INACTIVO

Las categorías deben ser administrables para permitir agregar nuevas categorías posteriormente.

**10. Niveles de riesgo**

La tabla niveles\_riesgo permite clasificar la gravedad o nivel de riesgo de una situación.

Campos:

niveles\_riesgo

├── id\_nivel

├── nombre

├── color

└── descripcion

El campo color puede utilizarse para representar visualmente el nivel de riesgo en la interfaz.

Ejemplo conceptual:

Nivel de riesgo

|

+--- Nombre

+--- Color

+--- Descripción

Los valores concretos deben provenir de la configuración de la base de datos.

**11. Estados de reportes**

La tabla estados\_reporte contiene los estados posibles de un reporte ciudadano.

estados\_reporte

├── id\_estado

├── nombre

└── descripcion

Esta tabla se utiliza para determinar la situación del reporte.

Los estados definitivos deben ser cargados mediante datos iniciales.

**12. Reportes ciudadanos**

La tabla reportes representa el núcleo del proceso de recepción de información ciudadana.

Campos:

reportes

├── id\_reporte

├── codigo\_reporte

├── id\_usuario

├── id\_categoria

├── id\_ubicacion

├── id\_nivel

├── id\_estado

├── titulo

├── descripcion

├── fecha\_incidente

├── fecha\_reporte

├── evidencia\_url

└── observaciones\_admin

Cada reporte está relacionado con:

Usuario

Categoría

Ubicación

Nivel de riesgo

Estado del reporte

Relaciones:

USUARIO 1 ──────── N REPORTES

CATEGORIA 1 ─────── N REPORTES

UBICACION 1 ─────── N REPORTES

NIVEL\_RIESGO 1 ──── N REPORTES

ESTADO\_REPORTE 1 ─ N REPORTES

**13. Flujo de un reporte**

El proceso esperado es:

Ciudadano

|

v

Formulario de reporte

|

v

Validación

|

v

POST /api/reportes

|

v

Base de datos

|

v

Reporte registrado

|

v

Administrador revisa

El reporte no debe confundirse automáticamente con una alerta pública.

**14. Verificaciones**

La tabla verificaciones registra las acciones de verificación realizadas sobre los reportes.

Campos:

verificaciones

├── id\_verificacion

├── id\_reporte

├── id\_administrador

├── resultado

├── comentarios

└── fecha\_verificacion

Resultado:

VERIFICADO

RECHAZADO

Relaciones:

REPORTE 1 ──────── N VERIFICACIONES

USUARIO 1 ─────── N VERIFICACIONES

El usuario asociado a id\_administrador debe ser un usuario autorizado para realizar verificaciones.

**15. Flujo de verificación**

REPORTE

|

v

REVISIÓN ADMINISTRATIVA

|

+----------------------+

| |

v v

VERIFICADO RECHAZADO

|

v

Puede generar

una alerta pública

La verificación debe quedar registrada para mantener trazabilidad.

**16. Estados de alertas**

La tabla estados\_alerta almacena los estados posibles de las alertas públicas.

estados\_alerta

├── id\_estado\_alerta

├── nombre

└── descripcion

Los estados definitivos deben cargarse en la base de datos.

El sistema debe permitir cambiar el estado de una alerta únicamente a usuarios autorizados.

**17. Alertas públicas**

La tabla alertas representa las alertas que serán publicadas y consultadas por los usuarios.

Campos:

alertas

├── id\_alerta

├── codigo\_alerta

├── id\_reporte

├── id\_administrador

├── id\_categoria

├── id\_ubicacion

├── id\_nivel

├── id\_estado\_alerta

├── titulo

├── descripcion

├── recomendaciones

├── fecha\_publicacion

├── fecha\_actualizacion

└── fecha\_finalizacion

Una alerta puede estar relacionada con un reporte:

REPORTE 1 ─────── 0..N ALERTAS

El campo id\_reporte puede ser NULL, por lo que la arquitectura debe contemplar que una alerta pueda existir sin estar asociada obligatoriamente a un reporte.

**18. Diferencia entre reporte y alerta**

Este concepto es fundamental.

**Reporte**

Es la información registrada por un ciudadano.

Ciudadano

↓

Reporte

**Alerta**

Es información pública gestionada por el sistema y asociada a un administrador.

Administrador

↓

Alerta pública

Por lo tanto:

REPORTE

↓

VERIFICACIÓN

↓

ALERTA

No todos los reportes necesariamente deben convertirse en alertas.

**19. Historial de alertas**

La tabla historial\_alertas mantiene el historial de cambios de estado.

Campos:

historial\_alertas

├── id\_historial

├── id\_alerta

├── id\_usuario

├── estado\_anterior

├── estado\_nuevo

├── comentario

└── fecha\_cambio

Esto permite conocer:

- Quién realizó el cambio.
- Estado anterior.
- Estado nuevo.
- Comentario.
- Fecha del cambio.

Flujo:

ALERTA

|

v

Cambio de estado

|

v

HISTORIAL

|

v

Nuevo estado

**20. Notificaciones**

La tabla notificaciones permite almacenar las notificaciones enviadas a los usuarios.

Campos:

notificaciones

├── id\_notificacion

├── id\_usuario

├── id\_alerta

├── titulo

├── mensaje

├── tipo

├── leida

└── fecha\_envio

Tipos:

ALERTA

REPORTE

SISTEMA

El campo leida permite determinar si el usuario ya consultó la notificación.

**21. Preferencias de notificación**

La tabla preferencias\_notificacion permite que cada usuario configure qué tipo de información desea recibir.

Campos:

preferencias\_notificacion

├── id\_preferencia

├── id\_usuario

├── recibir\_alertas

├── recibir\_reportes

├── recibir\_prevencion

└── radio\_km

El usuario puede configurar:

Recibir alertas

Recibir reportes

Recibir prevención

Radio de interés

El campo radio\_km permite establecer una distancia de interés alrededor de la ubicación correspondiente.

**22. Contactos de emergencia**

La plataforma incluye un directorio de servicios de emergencia.

Se divide en dos tablas:

tipos\_contacto

|

v

contactos\_emergencia

**23. Tipos de contacto**

Tabla:

tipos\_contacto

├── id\_tipo\_contacto

├── nombre

└── descripcion

Permite clasificar los contactos de emergencia.

**24. Contactos de emergencia**

Tabla:

contactos\_emergencia

├── id\_contacto

├── id\_tipo\_contacto

├── nombre\_institucion

├── telefono

├── direccion

├── departamento

├── provincia

├── distrito

├── descripcion

└── estado

El sistema puede mostrar estos contactos en una sección de auxilio.

**25. Prevención**

AlertaSegura incluye un módulo de información preventiva.

Se utilizan dos tablas:

categorias\_prevencion

|

v

informacion\_prevencion

**26. Categorías de prevención**

Tabla:

categorias\_prevencion

├── id\_categoria\_prevencion

├── nombre

├── descripcion

├── imagen\_url

└── estado

Permite clasificar los contenidos preventivos.

**27. Información preventiva**

Tabla:

informacion\_prevencion

├── id\_informacion

├── id\_categoria\_prevencion

├── titulo

├── antes

├── durante

├── despues

└── fecha\_actualizacion

La información está organizada explícitamente en:

ANTES

DURANTE

DESPUÉS

La plataforma debe mostrar esta información de manera clara y organizada.

**28. Auditoría**

La tabla auditoria permite registrar acciones administrativas realizadas dentro del sistema.

Campos:

auditoria

├── id\_auditoria

├── id\_usuario

├── accion

├── tabla\_afectada

├── id\_registro

├── descripcion

└── fecha\_accion

La auditoría permite conocer:

- Qué usuario realizó una acción.
- Qué acción realizó.
- Sobre qué tabla.
- Sobre qué registro.
- Qué ocurrió.
- Cuándo ocurrió.

Esto proporciona trazabilidad administrativa.

**29. Modelo general de relaciones**

La estructura general de la base de datos puede entenderse así:

ROLES

|

v

USUARIOS

/ | \\

/ | \\

v v  v

REPORTES VERIFICACIONES AUDITORIA

|

|

+-------+-------+--------+

| | | |

v v  v  v

CATEGORIA UBICACION RIESGO ESTADO

|

|

v

ALERTAS

|

+----+---------+

| |

v v

HISTORIAL NOTIFICACIONES

|

v

PREFERENCIAS

TIPOS\_CONTACTO

|

v

CONTACTOS\_EMERGENCIA

CATEGORIAS\_PREVENCION

|

v

INFORMACION\_PREVENCION

**30. Estructura de construcción del sistema**

El sistema debe construirse respetando el modelo de datos existente.

El orden recomendado es:

1. Base de datos

↓

2. Backend

↓

3. API REST

↓

4. Seguridad

↓

5. Frontend

↓

6. Integración con API

↓

7. Mapa

↓

8. Notificaciones

↓

9. Prevención

↓

10. Contactos de emergencia

↓

11. Auditoría

↓

12. Pruebas

↓

13. Despliegue

**31. Tecnologías**

**Base de datos**

La base de datos definida actualmente es:

**MySQL 8.0+**

No se debe cambiar a PostgreSQL sin modificar previamente la arquitectura y el script de base de datos.

**Backend**

Tecnología propuesta:

- Java
- Spring Boot
- Maven
- Spring Data JPA
- Spring Security
- API REST

**Frontend**

Tecnologías:

- Angular
- TypeScript
- HTML
- CSS

**Mapa**

Tecnologías propuestas:

- Leaflet
- OpenStreetMap

**32.** **Arquitectura** **general**

ALERTASEGURA

|

+--------------+--------------+

| |

v v

FRONTEND BACKEND

Angular Spring Boot

| |

| API REST

| |

+-------------+---------------+

|

v

MySQL

**33. Arquitectura** **Backend**

El backend debe dividirse en capas.

backend/

│

├── controller/

├── service/

├── repository/

├── entity/

├── dto/

├── security/

├── config/

├── exception/

└── util/

**34.** **Controllers**

Los Controllers reciben solicitudes HTTP.

Ejemplos:

AuthController

UsuarioController

ReporteController

VerificacionController

AlertaController

NotificacionController

PreferenciaNotificacionController

ContactoEmergenciaController

PrevencionController

AuditoriaController

No todos tienen que implementarse inmediatamente.

Se deben construir según el orden de prioridad del sistema.

**35.** **Services**

Los Services contienen la lógica de negocio.

Ejemplo:

ReporteController

↓

ReporteService

↓

ReporteRepository

↓

MySQL

El Controller no debe contener toda la lógica de negocio.

**36.** **Repositories**

Los repositories permiten acceder a MySQL mediante Spring Data JPA.

Ejemplo:

ReporteRepository

AlertaRepository

UsuarioRepository

CategoriaEmergenciaRepository

UbicacionRepository

NotificacionRepository

**37.** **Entities**

Las principales entidades corresponden a las tablas de MySQL.

Rol

Usuario

Ubicacion

CategoriaEmergencia

NivelRiesgo

EstadoReporte

Reporte

Verificacion

EstadoAlerta

Alerta

HistorialAlerta

Notificacion

PreferenciaNotificacion

TipoContacto

ContactoEmergencia

CategoriaPrevencion

InformacionPrevencion

Auditoria

**38.** **DTOs**

Los DTO deben utilizarse para controlar los datos enviados y recibidos por la API.

Ejemplos:

LoginRequest

RegistroUsuarioRequest

CrearReporteRequest

ReporteResponse

CrearAlertaRequest

ActualizarAlertaRequest

AlertaResponse

VerificacionRequest

NotificacionResponse

PreferenciaNotificacionRequest

La estructura definitiva de los DTO debe corresponder a los casos de uso.

**39. API REST**

La API puede organizarse por recursos.

/api/auth

/api/usuarios

/api/roles

/api/reportes

/api/verificaciones

/api/alertas

/api/notificaciones

/api/preferencias-notificacion

/api/contactos-emergencia

/api/tipos-contacto

/api/categorias-prevencion

/api/informacion-prevencion

/api/auditoria

**40. API de reportes**

Operaciones principales:

POST /api/reportes

GET /api/reportes

GET /api/reportes/{id}

PUT /api/reportes/{id}

El acceso a determinadas operaciones debe depender del rol.

**41. API de verificaciones**

POST /api/verificaciones

GET /api/verificaciones/{id}

La creación de verificaciones debe estar restringida a usuarios autorizados.

**42. API de alertas**

GET /api/alertas

GET /api/alertas/{id}

POST /api/alertas

PUT /api/alertas/{id}

Las operaciones administrativas deben estar protegidas.

**43. API de notificaciones**

GET /api/notificaciones

PUT /api/notificaciones/{id}/leer

La información debe filtrarse por el usuario autenticado.

Un usuario no debe poder consultar las notificaciones de otro usuario.

**44. API de prevención**

GET /api/categorias-prevencion

GET /api/informacion-prevencion

GET /api/informacion-prevencion/{id}

La información preventiva puede ser pública.

Las operaciones de administración deben estar protegidas.

**45. API de contactos**

GET /api/contactos-emergencia

GET /api/contactos-emergencia/{id}

Los usuarios pueden consultar los contactos activos.

La administración de contactos debe estar restringida.

**46.** **Frontend**

La aplicación Angular debe dividirse por funcionalidades.

src/app/

│

├── core/

├── shared/

├── auth/

├── usuarios/

├── reportes/

├── verificaciones/

├── alertas/

├── mapa/

├── notificaciones/

├── prevencion/

├── auxilio/

└── admin/

**47. Módulo de autenticación**

Debe manejar:

- Login.
- Registro.
- Cierre de sesión.
- Sesión del usuario.
- Roles.
- Protección de rutas.

Flujo:

Usuario

↓

Login

↓

Backend

↓

Validación

↓

Token / sesión

↓

Angular

↓

Acceso según rol

**48. Módulo de reportes**

Debe permitir:

- Crear reporte.
- Consultar reportes propios.
- Visualizar estado.
- Consultar información del reporte.

Formulario conceptual:

Título

Descripción

Categoría

Nivel de riesgo

Ubicación

Fecha del incidente

Evidencia

**49. Módulo de administración de reportes**

Los usuarios autorizados podrán:

- Consultar reportes.
- Revisar información.
- Consultar evidencia.
- Verificar.
- Rechazar.
- Registrar comentarios administrativos.

**50. Módulo de alertas**

Debe permitir:

- Listar alertas.
- Consultar detalle.
- Visualizar estado.
- Mostrar nivel de riesgo.
- Mostrar ubicación.
- Mostrar recomendaciones.
- Mostrar fecha de publicación.
- Mostrar fecha de actualización.

**51. Mapa**

El módulo de mapa debe utilizar:

Angular

↓

API de alertas

↓

Coordenadas

↓

Leaflet

↓

OpenStreetMap

Cada alerta debe poder representarse mediante un marcador.

El marcador debe permitir acceder al detalle de la alerta.

**52. Filtros del mapa**

El mapa/listado debe permitir filtrar alertas por información disponible en la base de datos.

Principalmente:

Categoría

Nivel de riesgo

Estado

Fecha

Distrito

Los filtros definitivos deben corresponder a las funcionalidades documentadas.

**53. Notificaciones**

El sistema debe permitir mostrar:

Notificaciones de alerta

Notificaciones de reporte

Notificaciones del sistema

Una notificación puede estar relacionada con una alerta.

También debe permitir marcar una notificación como leída.

**54. Preferencias**

Cada usuario puede tener una configuración de preferencias:

Recibir alertas

Recibir reportes

Recibir prevención

Radio en kilómetros

La lógica de notificaciones debe respetar estas preferencias.

**55. Prevención**

La interfaz debe presentar la información de prevención mediante:

Categoría

↓

Información

├── Antes

├── Durante

└── Después

**56. Directorio de auxilio**

La interfaz debe mostrar:

Tipo de contacto

Institución

Teléfono

Dirección

Ubicación

Descripción

Los contactos inactivos no deberían mostrarse al usuario final.

**57. Auditoría**

Las acciones administrativas importantes deben poder registrarse.

Ejemplo:

Administrador

↓

Actualiza alerta

↓

Sistema realiza acción

↓

Auditoria

↓

Registro de acción

Ejemplo de información:

Usuario: administrador

Acción: ACTUALIZAR\_ESTADO

Tabla: alertas

Registro: 25

Descripción: Se actualizó el estado de la alerta

Fecha: ...

**58. Flujo completo de una alerta**

CIUDADANO

|

v

CREA UN REPORTE

|

v

REPORTES

|

v

ADMINISTRADOR

|

v

VERIFICACIÓN

/ \\

/ \\

v v

RECHAZADO VERIFICADO

|

v

ALERTA PÚBLICA

|

+--------------+--------------+

| | |

v v  v

MAPA NOTIFICACIONES CONSULTA

| |

+--------------+

|

v

SEGUIMIENTO

|

v

HISTORIAL ALERTA

|

v

FINALIZACIÓN

**59. Orden de construcción recomendado**

**ETAPA 1 - Base de datos**

La base de datos ya está definida.

Primero:

- Crear MySQL.
- Ejecutar el script.
- Crear la base AlertaSegura.
- Insertar datos iniciales.
- Comprobar relaciones.
- Comprobar claves foráneas.
- Probar consultas.

**ETAPA 2 - Backend base**

Crear:

Spring Boot

Java

Maven

MySQL

Spring Data JPA

Configurar:

application.properties

Conexión:

Spring Boot

↓

MySQL

**ETAPA 3 - Entidades**

Crear primero las entidades principales:

Rol

Usuario

Ubicacion

CategoriaEmergencia

NivelRiesgo

EstadoReporte

Reporte

EstadoAlerta

Alerta

Después:

Verificacion

HistorialAlerta

Notificacion

PreferenciaNotificacion

TipoContacto

ContactoEmergencia

CategoriaPrevencion

InformacionPrevencion

Auditoria

**ETAPA 4 -** **Repositories**

Crear los repositories correspondientes.

Ejemplo:

RolRepository

UsuarioRepository

UbicacionRepository

CategoriaEmergenciaRepository

NivelRiesgoRepository

EstadoReporteRepository

ReporteRepository

VerificacionRepository

EstadoAlertaRepository

AlertaRepository

HistorialAlertaRepository

NotificacionRepository

PreferenciaNotificacionRepository

TipoContactoRepository

ContactoEmergenciaRepository

CategoriaPrevencionRepository

InformacionPrevencionRepository

AuditoriaRepository

**ETAPA 5 -** **Services**

Implementar primero:

UsuarioService

ReporteService

VerificacionService

AlertaService

Después:

NotificacionService

PreferenciaNotificacionService

ContactoEmergenciaService

PrevencionService

AuditoriaService

**60. ETAPA 6 - API**

Primero implementar el flujo principal:

Usuarios

↓

Reportes

↓

Verificaciones

↓

Alertas

Este es el núcleo de AlertaSegura.

**61. ETAPA 7 - Seguridad**

Implementar:

- Spring Security.
- Autenticación.
- Autorización.
- Roles.
- Protección de endpoints.
- Contraseñas con hash.
- Manejo seguro de sesión/token.

**62. ETAPA 8 - Pruebas del** **backend**

Antes de construir todo el frontend:

Postman

↓

API

↓

Spring Boot

↓

MySQL

Probar:

- Login.
- Crear usuario.
- Crear reporte.
- Consultar reporte.
- Verificar reporte.
- Crear alerta.
- Consultar alerta.
- Actualizar alerta.
- Cambiar estado.
- Crear notificación.

**63. ETAPA 9 -** **Frontend**

Construir primero:

Login

↓

Layout

↓

Dashboard

↓

Reportes

↓

Alertas

Después:

Mapa

Notificaciones

Prevención

Auxilio

Administración

**64. ETAPA 10 - Integración del mapa**

Cuando las APIs de alertas funcionen correctamente:

MySQL

↓

Spring Boot

↓

GET /api/alertas

↓

Angular

↓

Leaflet

↓

Mapa

**65. ETAPA 11 - Notificaciones**

Implementar:

Notificación

↓

Usuario

↓

Preferencias

La lógica debe verificar las preferencias antes de enviar determinadas notificaciones.

**66. ETAPA 12 - Prevención y auxilio**

Implementar:

Prevención

├── Categorías

└── Antes/Durante/Después

Auxilio

├── Tipos

└── Contactos

**67. ETAPA 13 - Auditoría**

Registrar acciones administrativas importantes.

La auditoría debe implementarse después de tener funcionando las operaciones administrativas principales.

**68. ETAPA 14 - Pruebas completas**

Realizar pruebas de:

- Autenticación.
- Roles.
- Reportes.
- Verificaciones.
- Alertas.
- Estados.
- Historial.
- Notificaciones.
- Preferencias.
- Mapa.
- Prevención.
- Contactos.
- Auditoría.
- Validaciones.
- Seguridad.

**69. ETAPA 15 - Despliegue**

Arquitectura final:

INTERNET

|

+----------+----------+

| |

v v

FRONTEND BACKEND

Angular Spring Boot

| |

| API REST

| |

+----------+----------+

|

v

MySQL

La infraestructura concreta de despliegue debe definirse posteriormente.

**70. Estructura de carpetas recomendada**

AlertaSegura/

│

├── backend/

│ │

│ ├── src/

│ │ ├── main/

│ │ │ ├── java/

│ │ │ │ └── com/

│ │ │ │ └── alertasegura/

│ │ │ │ ├── controller/

│ │ │ │ ├── service/

│ │ │ │ ├── repository/

│ │ │ │ ├── entity/

│ │ │ │ ├── dto/

│ │ │ │ ├── security/

│ │ │ │ ├── config/

│ │ │ │ ├── exception/

│ │ │ │ └── util/

│ │ │ │

│ │ │ └── resources/

│ │ │ ├── application.properties

│ │ │ └── ...

│ │ │

│ │ └── test/

│ │

│ ├── pom.xml

│ └── README.md

│

├── frontend/

│ │

│ ├── src/

│ │ ├── app/

│ │ │ ├── core/

│ │ │ ├── shared/

│ │ │ ├── auth/

│ │ │ ├── usuarios/

│ │ │ ├── reportes/

│ │ │ ├── verificaciones/

│ │ │ ├── alertas/

│ │ │ ├── mapa/

│ │ │ ├── notificaciones/

│ │ │ ├── prevencion/

│ │ │ ├── auxilio/

│ │ │ └── admin/

│ │ │

│ │ ├── assets/

│ │ └── environments/

│ │

│ ├── angular.json

│ ├── package.json

│ └── README.md

│

├── database/

│ ├── schema.sql

│ ├── data.sql

│ └── README.md

│

├── docs/

│ ├── requisitos/

│ ├── casos-de-uso/

│ ├── diagramas/

│ └── arquitectura/

│

├── .gitignore

└── README.md

**71. Prioridad de desarrollo**

La prioridad recomendada es:

**PRIORIDAD 1 - Núcleo**

Usuarios

Roles

Reportes

Categorías

Ubicaciones

Niveles de riesgo

Estados de reportes

**PRIORIDAD 2 - Verificación**

Verificaciones

Alertas

Estados de alertas

Historial

**PRIORIDAD 3 - Interacción**

Notificaciones

Preferencias

Mapa

**PRIORIDAD 4 - Información**

Prevención

Contactos de emergencia

**PRIORIDAD 5 - Administración**

Auditoría

Administración

Estadísticas

**72. MVP**

El MVP debe concentrarse en el flujo principal:

REGISTRO

↓

LOGIN

↓

REPORTAR EMERGENCIA

↓

REVISAR REPORTE

↓

VERIFICAR

↓

CREAR/PUBLICAR ALERTA

↓

VISUALIZAR ALERTA

↓

MAPA

Después se incorporan:

Notificaciones

Historial

Prevención

Auxilio

Auditoría

**73. Reglas de desarrollo**

1. La base de datos actual utiliza MySQL 8.0+.
1. No cambiar PostgreSQL sin modificar la arquitectura y el script.
1. Mantener separación entre frontend y backend.
1. Utilizar API REST.
1. No colocar lógica de negocio compleja dentro de Controllers.
1. Utilizar Services para la lógica de negocio.
1. Utilizar Repositories para acceso a datos.
1. Utilizar DTOs para las entradas y salidas de la API.
1. Proteger operaciones administrativas.
1. No almacenar contraseñas en texto plano.
1. Mantener trazabilidad de acciones administrativas.
1. Respetar las relaciones existentes de la base de datos.
1. No eliminar tablas ni relaciones sin justificar el cambio.
1. No crear funcionalidades que contradigan la documentación.
1. Probar cada módulo antes de continuar con el siguiente.
1. Mantener frontend y backend sincronizados.
1. Mantener la documentación actualizada.

**74. Regla para IA utilizada durante el desarrollo**

Si una IA trabaja sobre el proyecto AlertaSegura, debe utilizar este archivo como contexto general.

Antes de modificar código debe:

1. Revisar el contexto.

2. Revisar la estructura existente.

3. Identificar el módulo afectado.

4. Revisar las entidades relacionadas.

5. Revisar los endpoints existentes.

6. Revisar las dependencias.

7. Proponer los cambios necesarios.

8. Implementar sin romper funcionalidades existentes.

9. Probar los cambios.

10. Explicar qué archivos fueron modificados.

La IA no debe asumir que una funcionalidad existe si no se encuentra en el código.

Tampoco debe crear tablas, endpoints o módulos innecesarios sin justificar su necesidad.

**75. Estado de construcción**

[ ] Crear base de datos MySQL

[ ] Ejecutar schema.sql

[ ] Insertar datos iniciales

[ ] Configurar Spring Boot

[ ] Configurar conexión MySQL

[ ] Crear Entities

[ ] Crear Repositories

[ ] Crear Services

[ ] Crear DTOs

[ ] Crear Controllers

[ ] Crear API REST

[ ] Implementar autenticación

[ ] Implementar autorización

[ ] Implementar usuarios

[ ] Implementar reportes

[ ] Implementar verificaciones

[ ] Implementar alertas

[ ] Implementar estados

[ ] Implementar historial

[ ] Implementar notificaciones

[ ] Implementar preferencias

[ ] Implementar mapa

[ ] Implementar prevención

[ ] Implementar contactos de emergencia

[ ] Implementar auditoría

[ ] Crear frontend Angular

[ ] Integrar frontend con API

[ ] Realizar pruebas

[ ] Desplegar

**76. Flujo funcional completo**

ALERTASEGURA

|

v

USUARIO

|

+---------+---------+

| |

v v

REPORTAR CONSULTAR

| |

v v

REPORTE ALERTAS

| |

v v

VERIFICACIÓN MAPA

/ \\ |

/ \\ v

v v UBICACIÓN

RECHAZADO VERIFICADO

|

v

ALERTA

|

+------------+------------+

| | |

v v  v

NOTIFICACIÓN HISTORIAL ESTADO

| |

v v

USUARIO SEGUIMIENTO

INFORMACIÓN COMPLEMENTARIA

|

+-------+-------+

| |

v v

PREVENCIÓN AUXILIO

|

v

ANTES/DURANTE/DESPUÉS

**77. Resumen del sistema**

AlertaSegura es una plataforma web de emergencias basada en un flujo de:

**Reporte → Verificación → Alerta → Notificación → Consulta → Seguimiento.**

El ciudadano genera un **reporte ciudadano**.

El reporte se almacena junto con:

- Usuario.
- Categoría.
- Ubicación.
- Nivel de riesgo.
- Estado.
- Descripción.
- Fecha.
- Evidencia.

Posteriormente, un usuario autorizado puede realizar una **verificación**.

Si corresponde, el sistema puede generar una **alerta pública**.

La alerta contiene:

- Categoría.
- Ubicación.
- Nivel de riesgo.
- Estado.
- Descripción.
- Recomendaciones.
- Fechas.
- Administrador responsable.

La alerta puede cambiar de estado y cada cambio puede registrarse en el historial.

Los usuarios pueden recibir notificaciones relacionadas con las alertas y configurar sus preferencias.

El sistema también proporciona:

- Mapa geolocalizado.
- Información preventiva.
- Directorio de contactos de emergencia.
- Auditoría administrativa.

La base de datos está implementada en **MySQL 8.0+** y contiene 18 tablas relacionadas.

**78. Principio central**

El sistema debe mantener claramente separadas estas tres etapas:

REPORTE

Información enviada por un ciudadano.

↓

VERIFICACIÓN

Revisión realizada por un usuario autorizado.

↓

ALERTA

Información gestionada/publicada para los usuarios.
