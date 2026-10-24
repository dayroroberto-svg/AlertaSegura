-- MySQL dump 10.13  Distrib 9.7.0, for Win64 (x86_64)
--
-- Host: localhost    Database: alertasegura
-- ------------------------------------------------------
-- Server version	9.7.0

-- Datos exportados desde la base alertasegura el 2026-10-02.
-- Ejecutar después de schema.sql.
USE alertasegura;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `alertas`
--


--
-- Dumping data for table `auditoria`
--


--
-- Dumping data for table `categorias_emergencia`
--

INSERT INTO `categorias_emergencia` (`id_categoria`, `nombre`, `descripcion`, `icono`, `estado`) VALUES (1,'INCENDIO','Incendios forestales o urbanos','local_fire_department','ACTIVO'),(2,'SISMO','Movimientos sísmicos y terremotos','vibration','ACTIVO'),(3,'INUNDACION','Inundaciones por lluvias o desborde de ríos','water','ACTIVO'),(4,'ACCIDENTE_TRANSITO','Accidentes vehiculares y de tránsito','car_crash','ACTIVO'),(5,'DESLIZAMIENTO','Deslizamientos de tierra y huaicos','landslide','ACTIVO'),(6,'ROBO','Robos, asaltos e inseguridad ciudadana','warning','ACTIVO'),(7,'EMERGENCIA_MEDICA','Emergencias médicas y sanitarias','medical_services','ACTIVO'),(8,'COLAPSO_ESTRUCTURAL','Colapso de edificaciones o infraestructura','domain_disabled','ACTIVO'),(9,'FUGA_GAS','Fugas de gas o sustancias peligrosas','gas_meter','ACTIVO'),(10,'OTROS','Otras emergencias no categorizadas','report_problem','ACTIVO');

--
-- Dumping data for table `categorias_prevencion`
--

INSERT INTO `categorias_prevencion` (`id_categoria_prevencion`, `nombre`, `descripcion`, `imagen_url`, `estado`) VALUES (1,'SISMOS','Información preventiva ante movimientos sísmicos',NULL,'ACTIVO'),(2,'INCENDIOS','Información preventiva ante incendios',NULL,'ACTIVO'),(3,'INUNDACIONES','Información preventiva ante inundaciones y huaicos',NULL,'ACTIVO'),(4,'PRIMEROS_AUXILIOS','Guía básica de primeros auxilios',NULL,'ACTIVO'),(5,'SEGURIDAD_CIUDADANA','Recomendaciones de seguridad ciudadana',NULL,'ACTIVO');

--
-- Dumping data for table `contactos_emergencia`
--

INSERT INTO `contactos_emergencia` (`id_contacto`, `id_tipo_contacto`, `nombre_institucion`, `telefono`, `direccion`, `departamento`, `provincia`, `distrito`, `descripcion`, `estado`) VALUES (1,1,'Central de Bomberos','116','','Lima','Lima','','Línea nacional de emergencias - Bomberos','ACTIVO'),(2,1,'Compañía de Bomberos Ate N° 126','01-3511116','Av. Nicolás Ayllón cdra. 45','Lima','Lima','Ate','Compañía de bomberos del distrito de Ate','ACTIVO'),(3,2,'Emergencias PNP','105','','Lima','Lima','','Línea de emergencias de la Policía Nacional','ACTIVO'),(4,2,'Comisaría PNP Ate','01-3260530','Av. Nicolás Ayllón','Lima','Lima','Ate','Comisaría del distrito de Ate','ACTIVO'),(5,2,'Comisaría PNP Santa Anita','01-3621025','Av. Los Eucaliptos','Lima','Lima','Santa Anita','Comisaría del distrito de Santa Anita','ACTIVO'),(6,3,'SAMU - Sistema de Atención Móvil de Urgencia','106','','Lima','Lima','','Servicio de ambulancias del Ministerio de Salud','ACTIVO'),(7,4,'INDECI','115','Calle Ricardo Angulo 694, San Isidro','Lima','Lima','San Isidro','Instituto Nacional de Defensa Civil','ACTIVO'),(8,5,'Serenazgo Ate','01-4781212','Municipalidad de Ate','Lima','Lima','Ate','Central de serenazgo del distrito de Ate','ACTIVO'),(9,5,'Serenazgo Santa Anita','01-3621212','Municipalidad de Santa Anita','Lima','Lima','Santa Anita','Central de serenazgo de Santa Anita','ACTIVO'),(10,6,'Hospital Vitarte','01-3511444','Av. Nicolás Ayllón 5880','Lima','Lima','Ate','Hospital de Vitarte - MINSA','ACTIVO'),(11,6,'Hospital Bravo Chico','01-3620078','Av. Canto Grande','Lima','Lima','San Juan de Lurigancho','Hospital Bravo Chico','ACTIVO');

--
-- Dumping data for table `estados_alerta`
--

INSERT INTO `estados_alerta` (`id_estado_alerta`, `nombre`, `descripcion`) VALUES (1,'ACTIVA','Alerta activa y visible para los usuarios'),(2,'EN_SEGUIMIENTO','Alerta bajo seguimiento activo'),(3,'CONTROLADA','Situación controlada, en observación'),(4,'FINALIZADA','Alerta finalizada, situación resuelta'),(5,'CANCELADA','Alerta cancelada');

--
-- Dumping data for table `estados_reporte`
--

INSERT INTO `estados_reporte` (`id_estado`, `nombre`, `descripcion`) VALUES (1,'PENDIENTE','Reporte recibido, pendiente de revisión'),(2,'EN_REVISION','Reporte en proceso de revisión administrativa'),(3,'VERIFICADO','Reporte verificado por un administrador'),(4,'RECHAZADO','Reporte rechazado por un administrador'),(5,'ARCHIVADO','Reporte archivado');

--
-- Dumping data for table `historial_alertas`
--


--
-- Dumping data for table `informacion_prevencion`
--

INSERT INTO `informacion_prevencion` (`id_informacion`, `id_categoria_prevencion`, `titulo`, `antes`, `durante`, `despues`, `fecha_actualizacion`) VALUES (1,1,'¿Qué hacer ante un sismo?','Identifica las zonas seguras de tu hogar y centro de trabajo. Prepara una mochila de emergencia con agua, linterna, botiquín, documentos y radio a pilas. Participa activamente en simulacros. Asegura muebles pesados y objetos que puedan caer. Establece un punto de encuentro familiar.','Mantén la calma y no corras. Ubícate en la zona segura identificada (columnas, vigas, marcos de puertas). Si estás en un edificio, aléjate de ventanas y objetos que puedan caer. Si estás en la calle, aléjate de postes, cables y edificios. Protege tu cabeza con los brazos o un objeto resistente.','Revisa si hay daños estructurales en tu vivienda antes de ingresar. No uses ascensores. Verifica que no haya fugas de gas o cortocircuitos. Atiende a personas heridas si puedes hacerlo con seguridad. Mantente informado por fuentes oficiales. Ten cuidado con las réplicas.','2026-09-26 11:35:36'),(2,2,'¿Qué hacer ante un incendio?','Instala detectores de humo en tu hogar. Ten un extintor vigente y aprende a usarlo. Conoce las rutas de evacuación. No sobrecargues las tomas de corriente. Revisa periódicamente las instalaciones eléctricas y de gas. Almacena productos inflamables de forma segura.','Llama inmediatamente a los bomberos (116). Sal del lugar agachado para evitar el humo. Cubre tu nariz y boca con un paño húmedo. No uses ascensores. Toca las puertas antes de abrirlas: si están calientes, no las abras. Si tu ropa se incendia, tírate al piso y rueda.','No regreses al lugar hasta que los bomberos lo autoricen. Ventila los ambientes afectados. Revisa las instalaciones antes de reconectar servicios. Documenta los daños para el seguro. Busca apoyo emocional si lo necesitas.','2026-09-26 11:35:36'),(3,3,'¿Qué hacer ante una inundación?','No construyas ni habites en zonas inundables o cauces de ríos. Limpia periódicamente desagües, canaletas y alcantarillas. Prepara una mochila de emergencia. Identifica las zonas altas y rutas de evacuación de tu zona. Mantente informado sobre alertas meteorológicas.','Corta inmediatamente la energía eléctrica. Dirígete a zonas altas. No camines ni conduzcas por aguas turbulentas. Aléjate de ríos, quebradas y cauces. No intentes cruzar puentes sobre ríos crecidos. Lleva contigo a tus mascotas si es seguro hacerlo.','Desinfecta el agua antes de consumirla. No consumas alimentos que hayan estado en contacto con el agua. Revisa las instalaciones eléctricas antes de reconectar. Limpia y desinfecta tu vivienda. Reporta daños a las autoridades. Cuídate de enfermedades transmitidas por el agua.','2026-09-26 11:35:36'),(4,4,'¿Cómo actuar en primeros auxilios?','Toma un curso básico de primeros auxilios. Ten un botiquín de emergencia en casa, trabajo y auto. Aprende las maniobras de RCP básico. Conoce los números de emergencia (106 - SAMU, 116 - Bomberos, 105 - PNP). Identifica alergias y condiciones médicas de tu familia.','Evalúa la seguridad de la escena antes de actuar. Llama a los servicios de emergencia. No muevas a la víctima a menos que esté en peligro inmediato. Controla hemorragias con presión directa. Mantén abrigada a la víctima. No administres medicamentos sin conocimiento.','Mantén a la víctima estable hasta que llegue la ayuda profesional. Proporciona información clara al personal de emergencia. Acompaña a la víctima al centro de salud si es necesario. Registra los datos del incidente para el seguimiento médico.','2026-09-26 11:35:36'),(5,5,'¿Cómo prevenir situaciones de inseguridad?','Evita caminar solo por zonas oscuras o desoladas. No exhibas objetos de valor en la vía pública. Varía tus rutas y horarios habituales. Mantén comunicación constante con familiares. Guarda los números de serenazgo y comisaría de tu zona. Conoce a tus vecinos y organiza juntas vecinales.','Mantén la calma y no opongas resistencia física. Observa y memoriza las características del agresor. Busca ayuda gritando o usando un silbato. Dirígete a un lugar con personas. Llama al 105 (PNP) o al serenazgo de tu distrito.','Realiza la denuncia en la comisaría más cercana. Busca atención médica si fuiste agredido. Guarda toda evidencia posible. Solicita apoyo psicológico si lo necesitas. Comparte la información con tu comunidad para alertar a otros.','2026-09-26 11:35:36');

--
-- Dumping data for table `niveles_riesgo`
--

INSERT INTO `niveles_riesgo` (`id_nivel`, `nombre`, `color`, `descripcion`) VALUES (1,'BAJO','#4CAF50','Situación de bajo riesgo, sin peligro inmediato'),(2,'MODERADO','#FFC107','Situación de riesgo moderado, requiere atención'),(3,'ALTO','#FF9800','Situación de alto riesgo, requiere acción inmediata'),(4,'CRITICO','#F44336','Situación crítica, peligro extremo');

--
-- Dumping data for table `notificaciones`
--


--
-- Dumping data for table `preferencias_notificacion`
--


--
-- Dumping data for table `reportes`
--


--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`, `descripcion`) VALUES (1,'ADMINISTRADOR','Usuario con permisos administrativos completos'),(2,'CIUDADANO','Usuario ciudadano con acceso básico a la plataforma');

--
-- Dumping data for table `tipos_contacto`
--

INSERT INTO `tipos_contacto` (`id_tipo_contacto`, `nombre`, `descripcion`) VALUES (1,'BOMBEROS','Cuerpo General de Bomberos Voluntarios del Perú'),(2,'POLICIA','Policía Nacional del Perú'),(3,'AMBULANCIA','Servicios de atención pre-hospitalaria y ambulancia'),(4,'DEFENSA_CIVIL','Instituto Nacional de Defensa Civil - INDECI'),(5,'SERENAZGO','Servicio de serenazgo municipal'),(6,'HOSPITAL','Centros hospitalarios y establecimientos de salud');

--
-- Dumping data for table `ubicaciones`
--


--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `id_rol`, `nombres`, `apellidos`, `correo`, `contrasena`, `telefono`, `estado`, `fecha_registro`, `ultima_conexion`) VALUES (1,1,'Administrador','Sistema','admin@alertasegura.pe','$2a$10$1819536/AAFybYzE.mrRouyoRMcx/TWl9WI5lCrVSSDwsi3KorSEO','999999999','ACTIVO','2026-09-26 11:35:36','2026-09-26 14:04:45'),(4,2,'Dayro','Sullon','dayro123@gmail.com','$2a$10$P2xDRDIpcKfuey3QjDCxLuHhwzfDZw.yqpyNzjC83LRO9HvV0RUvi','910229877','ACTIVO','2026-09-30 18:59:03','2026-09-30 22:48:52'),(10,2,'Cristhian','Sullon','cristhian@gmail.com','$2a$10$mnvLfZZdBR2YboYRQc1FFugVHp4xpKui32qNr.Xj.LEl.cICe66OC','960430469','ACTIVO','2026-09-30 23:43:36','2026-09-30 23:44:00'),(11,2,'Dayro','Sullon Vigo','dayro.roberto@gmail.com','$2a$10$SJ/yIXP0.QjgVw419//A4u3iW9n2YhUPGShKS8pO983D7oOlxjVa.','910229877','ACTIVO','2026-10-01 00:18:25',NULL);

--
-- Dumping data for table `verificaciones`
--

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-02  0:57:16
