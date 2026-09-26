-- ============================================================
-- ALERTASEGURA - DATOS INICIALES
-- Ejecutar después de schema.sql
-- ============================================================

USE alertasegura;

-- ============================================================
-- ROLES
-- ============================================================
INSERT INTO roles (nombre, descripcion) VALUES
('ADMINISTRADOR', 'Usuario con permisos administrativos completos'),
('CIUDADANO', 'Usuario ciudadano con acceso básico a la plataforma');

-- ============================================================
-- NIVELES DE RIESGO
-- ============================================================
INSERT INTO niveles_riesgo (nombre, color, descripcion) VALUES
('BAJO', '#4CAF50', 'Situación de bajo riesgo, sin peligro inmediato'),
('MODERADO', '#FFC107', 'Situación de riesgo moderado, requiere atención'),
('ALTO', '#FF9800', 'Situación de alto riesgo, requiere acción inmediata'),
('CRITICO', '#F44336', 'Situación crítica, peligro extremo');

-- ============================================================
-- ESTADOS DE REPORTE
-- ============================================================
INSERT INTO estados_reporte (nombre, descripcion) VALUES
('PENDIENTE', 'Reporte recibido, pendiente de revisión'),
('EN_REVISION', 'Reporte en proceso de revisión administrativa'),
('VERIFICADO', 'Reporte verificado por un administrador'),
('RECHAZADO', 'Reporte rechazado por un administrador'),
('ARCHIVADO', 'Reporte archivado');

-- ============================================================
-- ESTADOS DE ALERTA
-- ============================================================
INSERT INTO estados_alerta (nombre, descripcion) VALUES
('ACTIVA', 'Alerta activa y visible para los usuarios'),
('EN_SEGUIMIENTO', 'Alerta bajo seguimiento activo'),
('CONTROLADA', 'Situación controlada, en observación'),
('FINALIZADA', 'Alerta finalizada, situación resuelta'),
('CANCELADA', 'Alerta cancelada');

-- ============================================================
-- CATEGORÍAS DE EMERGENCIA
-- ============================================================
INSERT INTO categorias_emergencia (nombre, descripcion, icono) VALUES
('INCENDIO', 'Incendios forestales o urbanos', 'local_fire_department'),
('SISMO', 'Movimientos sísmicos y terremotos', 'vibration'),
('INUNDACION', 'Inundaciones por lluvias o desborde de ríos', 'water'),
('ACCIDENTE_TRANSITO', 'Accidentes vehiculares y de tránsito', 'car_crash'),
('DESLIZAMIENTO', 'Deslizamientos de tierra y huaicos', 'landslide'),
('ROBO', 'Robos, asaltos e inseguridad ciudadana', 'warning'),
('EMERGENCIA_MEDICA', 'Emergencias médicas y sanitarias', 'medical_services'),
('COLAPSO_ESTRUCTURAL', 'Colapso de edificaciones o infraestructura', 'domain_disabled'),
('FUGA_GAS', 'Fugas de gas o sustancias peligrosas', 'gas_meter'),
('OTROS', 'Otras emergencias no categorizadas', 'report_problem');

-- ============================================================
-- TIPOS DE CONTACTO
-- ============================================================
INSERT INTO tipos_contacto (nombre, descripcion) VALUES
('BOMBEROS', 'Cuerpo General de Bomberos Voluntarios del Perú'),
('POLICIA', 'Policía Nacional del Perú'),
('AMBULANCIA', 'Servicios de atención pre-hospitalaria y ambulancia'),
('DEFENSA_CIVIL', 'Instituto Nacional de Defensa Civil - INDECI'),
('SERENAZGO', 'Servicio de serenazgo municipal'),
('HOSPITAL', 'Centros hospitalarios y establecimientos de salud');

-- ============================================================
-- CONTACTOS DE EMERGENCIA
-- ============================================================
INSERT INTO contactos_emergencia (id_tipo_contacto, nombre_institucion, telefono, direccion, departamento, provincia, distrito, descripcion) VALUES
-- Bomberos
(1, 'Central de Bomberos', '116', '', 'Lima', 'Lima', '', 'Línea nacional de emergencias - Bomberos'),
(1, 'Compañía de Bomberos Ate N° 126', '01-3511116', 'Av. Nicolás Ayllón cdra. 45', 'Lima', 'Lima', 'Ate', 'Compañía de bomberos del distrito de Ate'),
-- Policía
(2, 'Emergencias PNP', '105', '', 'Lima', 'Lima', '', 'Línea de emergencias de la Policía Nacional'),
(2, 'Comisaría PNP Ate', '01-3260530', 'Av. Nicolás Ayllón', 'Lima', 'Lima', 'Ate', 'Comisaría del distrito de Ate'),
(2, 'Comisaría PNP Santa Anita', '01-3621025', 'Av. Los Eucaliptos', 'Lima', 'Lima', 'Santa Anita', 'Comisaría del distrito de Santa Anita'),
-- Ambulancia
(3, 'SAMU - Sistema de Atención Móvil de Urgencia', '106', '', 'Lima', 'Lima', '', 'Servicio de ambulancias del Ministerio de Salud'),
-- Defensa Civil
(4, 'INDECI', '115', 'Calle Ricardo Angulo 694, San Isidro', 'Lima', 'Lima', 'San Isidro', 'Instituto Nacional de Defensa Civil'),
-- Serenazgo
(5, 'Serenazgo Ate', '01-4781212', 'Municipalidad de Ate', 'Lima', 'Lima', 'Ate', 'Central de serenazgo del distrito de Ate'),
(5, 'Serenazgo Santa Anita', '01-3621212', 'Municipalidad de Santa Anita', 'Lima', 'Lima', 'Santa Anita', 'Central de serenazgo de Santa Anita'),
-- Hospitales
(6, 'Hospital Vitarte', '01-3511444', 'Av. Nicolás Ayllón 5880', 'Lima', 'Lima', 'Ate', 'Hospital de Vitarte - MINSA'),
(6, 'Hospital Bravo Chico', '01-3620078', 'Av. Canto Grande', 'Lima', 'Lima', 'San Juan de Lurigancho', 'Hospital Bravo Chico');

-- ============================================================
-- CATEGORÍAS DE PREVENCIÓN
-- ============================================================
INSERT INTO categorias_prevencion (nombre, descripcion) VALUES
('SISMOS', 'Información preventiva ante movimientos sísmicos'),
('INCENDIOS', 'Información preventiva ante incendios'),
('INUNDACIONES', 'Información preventiva ante inundaciones y huaicos'),
('PRIMEROS_AUXILIOS', 'Guía básica de primeros auxilios'),
('SEGURIDAD_CIUDADANA', 'Recomendaciones de seguridad ciudadana');

-- ============================================================
-- INFORMACIÓN PREVENTIVA
-- ============================================================
INSERT INTO informacion_prevencion (id_categoria_prevencion, titulo, antes, durante, despues) VALUES
(1, '¿Qué hacer ante un sismo?',
 'Identifica las zonas seguras de tu hogar y centro de trabajo. Prepara una mochila de emergencia con agua, linterna, botiquín, documentos y radio a pilas. Participa activamente en simulacros. Asegura muebles pesados y objetos que puedan caer. Establece un punto de encuentro familiar.',
 'Mantén la calma y no corras. Ubícate en la zona segura identificada (columnas, vigas, marcos de puertas). Si estás en un edificio, aléjate de ventanas y objetos que puedan caer. Si estás en la calle, aléjate de postes, cables y edificios. Protege tu cabeza con los brazos o un objeto resistente.',
 'Revisa si hay daños estructurales en tu vivienda antes de ingresar. No uses ascensores. Verifica que no haya fugas de gas o cortocircuitos. Atiende a personas heridas si puedes hacerlo con seguridad. Mantente informado por fuentes oficiales. Ten cuidado con las réplicas.'),

(2, '¿Qué hacer ante un incendio?',
 'Instala detectores de humo en tu hogar. Ten un extintor vigente y aprende a usarlo. Conoce las rutas de evacuación. No sobrecargues las tomas de corriente. Revisa periódicamente las instalaciones eléctricas y de gas. Almacena productos inflamables de forma segura.',
 'Llama inmediatamente a los bomberos (116). Sal del lugar agachado para evitar el humo. Cubre tu nariz y boca con un paño húmedo. No uses ascensores. Toca las puertas antes de abrirlas: si están calientes, no las abras. Si tu ropa se incendia, tírate al piso y rueda.',
 'No regreses al lugar hasta que los bomberos lo autoricen. Ventila los ambientes afectados. Revisa las instalaciones antes de reconectar servicios. Documenta los daños para el seguro. Busca apoyo emocional si lo necesitas.'),

(3, '¿Qué hacer ante una inundación?',
 'No construyas ni habites en zonas inundables o cauces de ríos. Limpia periódicamente desagües, canaletas y alcantarillas. Prepara una mochila de emergencia. Identifica las zonas altas y rutas de evacuación de tu zona. Mantente informado sobre alertas meteorológicas.',
 'Corta inmediatamente la energía eléctrica. Dirígete a zonas altas. No camines ni conduzcas por aguas turbulentas. Aléjate de ríos, quebradas y cauces. No intentes cruzar puentes sobre ríos crecidos. Lleva contigo a tus mascotas si es seguro hacerlo.',
 'Desinfecta el agua antes de consumirla. No consumas alimentos que hayan estado en contacto con el agua. Revisa las instalaciones eléctricas antes de reconectar. Limpia y desinfecta tu vivienda. Reporta daños a las autoridades. Cuídate de enfermedades transmitidas por el agua.'),

(4, '¿Cómo actuar en primeros auxilios?',
 'Toma un curso básico de primeros auxilios. Ten un botiquín de emergencia en casa, trabajo y auto. Aprende las maniobras de RCP básico. Conoce los números de emergencia (106 - SAMU, 116 - Bomberos, 105 - PNP). Identifica alergias y condiciones médicas de tu familia.',
 'Evalúa la seguridad de la escena antes de actuar. Llama a los servicios de emergencia. No muevas a la víctima a menos que esté en peligro inmediato. Controla hemorragias con presión directa. Mantén abrigada a la víctima. No administres medicamentos sin conocimiento.',
 'Mantén a la víctima estable hasta que llegue la ayuda profesional. Proporciona información clara al personal de emergencia. Acompaña a la víctima al centro de salud si es necesario. Registra los datos del incidente para el seguimiento médico.'),

(5, '¿Cómo prevenir situaciones de inseguridad?',
 'Evita caminar solo por zonas oscuras o desoladas. No exhibas objetos de valor en la vía pública. Varía tus rutas y horarios habituales. Mantén comunicación constante con familiares. Guarda los números de serenazgo y comisaría de tu zona. Conoce a tus vecinos y organiza juntas vecinales.',
 'Mantén la calma y no opongas resistencia física. Observa y memoriza las características del agresor. Busca ayuda gritando o usando un silbato. Dirígete a un lugar con personas. Llama al 105 (PNP) o al serenazgo de tu distrito.',
 'Realiza la denuncia en la comisaría más cercana. Busca atención médica si fuiste agredido. Guarda toda evidencia posible. Solicita apoyo psicológico si lo necesitas. Comparte la información con tu comunidad para alertar a otros.');

-- ============================================================
-- USUARIO ADMINISTRADOR INICIAL
-- Contraseña: admin123 (hasheada con BCrypt)
-- ============================================================
INSERT INTO usuarios (id_rol, nombres, apellidos, correo, contrasena, telefono, estado) VALUES
(1, 'Administrador', 'Sistema', 'admin@alertasegura.pe', '$2a$10$1819536/AAFybYzE.mrRouyoRMcx/TWl9WI5lCrVSSDwsi3KorSEO', '999999999', 'ACTIVO');
