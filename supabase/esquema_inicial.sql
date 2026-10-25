-- Esquema inicial en Postgres, traducido del schema.sql de MySQL.
-- Son las mismas 18 tablas. Solo cambia usuarios, que ahora es perfiles y
-- cuelga de auth.users; la contraseña la guarda Supabase Auth.

create table public.roles (
    id_rol bigint generated always as identity primary key,
    nombre varchar(50) not null unique,
    descripcion varchar(255)
);

-- antes usuarios
create table public.perfiles (
    id_usuario bigint generated always as identity primary key,
    auth_id uuid not null unique references auth.users (id) on delete cascade,
    id_rol bigint not null references public.roles (id_rol),
    nombres varchar(100) not null,
    apellidos varchar(100) not null,
    correo varchar(150) not null unique,
    telefono varchar(20),
    estado varchar(20) not null default 'ACTIVO' check (estado in ('ACTIVO', 'INACTIVO', 'BLOQUEADO')),
    fecha_registro timestamptz not null default now(),
    ultima_conexion timestamptz
);
create index idx_perfil_estado on public.perfiles (estado);
create index idx_perfil_rol on public.perfiles (id_rol);

create table public.ubicaciones (
    id_ubicacion bigint generated always as identity primary key,
    departamento varchar(100),
    provincia varchar(100),
    distrito varchar(100),
    direccion varchar(255),
    latitud numeric(10, 8),
    longitud numeric(11, 8),
    referencia varchar(255)
);
create index idx_ubicacion_distrito on public.ubicaciones (distrito);
create index idx_ubicacion_coords on public.ubicaciones (latitud, longitud);

create table public.categorias_emergencia (
    id_categoria bigint generated always as identity primary key,
    nombre varchar(100) not null unique,
    descripcion varchar(255),
    icono varchar(100),
    estado varchar(20) not null default 'ACTIVO' check (estado in ('ACTIVO', 'INACTIVO'))
);

create table public.niveles_riesgo (
    id_nivel bigint generated always as identity primary key,
    nombre varchar(50) not null unique,
    color varchar(20),
    descripcion varchar(255)
);

create table public.estados_reporte (
    id_estado bigint generated always as identity primary key,
    nombre varchar(50) not null unique,
    descripcion varchar(255)
);

create table public.reportes (
    id_reporte bigint generated always as identity primary key,
    codigo_reporte varchar(20) not null unique,
    id_usuario bigint not null references public.perfiles (id_usuario),
    id_categoria bigint not null references public.categorias_emergencia (id_categoria),
    id_ubicacion bigint not null references public.ubicaciones (id_ubicacion),
    id_nivel bigint not null references public.niveles_riesgo (id_nivel),
    id_estado bigint not null references public.estados_reporte (id_estado),
    titulo varchar(200) not null,
    descripcion text,
    fecha_incidente timestamptz,
    fecha_reporte timestamptz not null default now(),
    evidencia_url varchar(500),
    observaciones_admin text
);
create index idx_reporte_usuario on public.reportes (id_usuario);
create index idx_reporte_estado on public.reportes (id_estado);
create index idx_reporte_fecha on public.reportes (fecha_reporte);
create index idx_reporte_categoria on public.reportes (id_categoria);
create index idx_reporte_ubicacion on public.reportes (id_ubicacion);
create index idx_reporte_nivel on public.reportes (id_nivel);

create table public.verificaciones (
    id_verificacion bigint generated always as identity primary key,
    id_reporte bigint not null references public.reportes (id_reporte),
    id_administrador bigint not null references public.perfiles (id_usuario),
    resultado varchar(20) not null check (resultado in ('VERIFICADO', 'RECHAZADO')),
    comentarios text,
    fecha_verificacion timestamptz not null default now()
);
create index idx_verificacion_reporte on public.verificaciones (id_reporte);
create index idx_verificacion_admin on public.verificaciones (id_administrador);

create table public.estados_alerta (
    id_estado_alerta bigint generated always as identity primary key,
    nombre varchar(50) not null unique,
    descripcion varchar(255)
);

create table public.alertas (
    id_alerta bigint generated always as identity primary key,
    codigo_alerta varchar(20) not null unique,
    id_reporte bigint references public.reportes (id_reporte),
    id_administrador bigint not null references public.perfiles (id_usuario),
    id_categoria bigint not null references public.categorias_emergencia (id_categoria),
    id_ubicacion bigint not null references public.ubicaciones (id_ubicacion),
    id_nivel bigint not null references public.niveles_riesgo (id_nivel),
    id_estado_alerta bigint not null references public.estados_alerta (id_estado_alerta),
    titulo varchar(200) not null,
    descripcion text,
    recomendaciones text,
    fecha_publicacion timestamptz not null default now(),
    fecha_actualizacion timestamptz,
    fecha_finalizacion timestamptz
);
create index idx_alerta_estado on public.alertas (id_estado_alerta);
create index idx_alerta_fecha on public.alertas (fecha_publicacion);
create index idx_alerta_reporte on public.alertas (id_reporte);
create index idx_alerta_admin on public.alertas (id_administrador);
create index idx_alerta_categoria on public.alertas (id_categoria);
create index idx_alerta_ubicacion on public.alertas (id_ubicacion);
create index idx_alerta_nivel on public.alertas (id_nivel);

create table public.historial_alertas (
    id_historial bigint generated always as identity primary key,
    id_alerta bigint not null references public.alertas (id_alerta),
    id_usuario bigint not null references public.perfiles (id_usuario),
    estado_anterior varchar(50),
    estado_nuevo varchar(50) not null,
    comentario text,
    fecha_cambio timestamptz not null default now()
);
create index idx_historial_alerta on public.historial_alertas (id_alerta);
create index idx_historial_usuario on public.historial_alertas (id_usuario);

create table public.notificaciones (
    id_notificacion bigint generated always as identity primary key,
    id_usuario bigint not null references public.perfiles (id_usuario),
    id_alerta bigint references public.alertas (id_alerta),
    titulo varchar(200) not null,
    mensaje text,
    tipo varchar(20) not null check (tipo in ('ALERTA', 'REPORTE', 'SISTEMA')),
    leida boolean not null default false,
    fecha_envio timestamptz not null default now()
);
create index idx_notificacion_usuario on public.notificaciones (id_usuario);
create index idx_notificacion_leida on public.notificaciones (id_usuario, leida);
create index idx_notificacion_alerta on public.notificaciones (id_alerta);

create table public.preferencias_notificacion (
    id_preferencia bigint generated always as identity primary key,
    id_usuario bigint not null unique references public.perfiles (id_usuario),
    recibir_alertas boolean not null default true,
    recibir_reportes boolean not null default true,
    recibir_prevencion boolean not null default true,
    radio_km numeric(5, 2) default 10.00
);

create table public.tipos_contacto (
    id_tipo_contacto bigint generated always as identity primary key,
    nombre varchar(100) not null unique,
    descripcion varchar(255)
);

create table public.contactos_emergencia (
    id_contacto bigint generated always as identity primary key,
    id_tipo_contacto bigint not null references public.tipos_contacto (id_tipo_contacto),
    nombre_institucion varchar(200) not null,
    telefono varchar(20),
    direccion varchar(255),
    departamento varchar(100),
    provincia varchar(100),
    distrito varchar(100),
    descripcion varchar(500),
    estado varchar(20) not null default 'ACTIVO' check (estado in ('ACTIVO', 'INACTIVO'))
);
create index idx_contacto_estado on public.contactos_emergencia (estado);
create index idx_contacto_tipo on public.contactos_emergencia (id_tipo_contacto);

create table public.categorias_prevencion (
    id_categoria_prevencion bigint generated always as identity primary key,
    nombre varchar(100) not null unique,
    descripcion varchar(255),
    imagen_url varchar(500),
    estado varchar(20) not null default 'ACTIVO' check (estado in ('ACTIVO', 'INACTIVO'))
);

create table public.informacion_prevencion (
    id_informacion bigint generated always as identity primary key,
    id_categoria_prevencion bigint not null references public.categorias_prevencion (id_categoria_prevencion),
    titulo varchar(200) not null,
    antes text,
    durante text,
    despues text,
    fecha_actualizacion timestamptz default now()
);
create index idx_info_categoria on public.informacion_prevencion (id_categoria_prevencion);

create table public.auditoria (
    id_auditoria bigint generated always as identity primary key,
    id_usuario bigint references public.perfiles (id_usuario),
    accion varchar(100) not null,
    tabla_afectada varchar(100),
    id_registro bigint,
    descripcion text,
    fecha_accion timestamptz not null default now()
);
create index idx_auditoria_usuario on public.auditoria (id_usuario);
create index idx_auditoria_fecha on public.auditoria (fecha_accion);
create index idx_auditoria_tabla on public.auditoria (tabla_afectada);

-- Reemplaza el ON UPDATE CURRENT_TIMESTAMP de MySQL
create function public.tg_fecha_actualizacion()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.fecha_actualizacion := now();
    return new;
end;
$$;

create trigger informacion_prevencion_fecha
    before update on public.informacion_prevencion
    for each row execute function public.tg_fecha_actualizacion();

-- Datos de los catálogos, tomados del data.sql de MySQL.
-- Los usuarios se cargaron aparte, ya con su cuenta en Auth.
insert into public.roles (nombre, descripcion) values
    ('ADMINISTRADOR', 'Usuario con permisos administrativos completos'),
    ('CIUDADANO', 'Usuario ciudadano con acceso básico a la plataforma');

insert into public.categorias_emergencia (nombre, descripcion, icono, estado) values
    ('INCENDIO', 'Incendios forestales o urbanos', 'local_fire_department', 'ACTIVO'),
    ('SISMO', 'Movimientos sísmicos y terremotos', 'vibration', 'ACTIVO'),
    ('INUNDACION', 'Inundaciones por lluvias o desborde de ríos', 'water', 'ACTIVO'),
    ('ACCIDENTE_TRANSITO', 'Accidentes vehiculares y de tránsito', 'car_crash', 'ACTIVO'),
    ('DESLIZAMIENTO', 'Deslizamientos de tierra y huaicos', 'landslide', 'ACTIVO'),
    ('ROBO', 'Robos, asaltos e inseguridad ciudadana', 'warning', 'ACTIVO'),
    ('EMERGENCIA_MEDICA', 'Emergencias médicas y sanitarias', 'medical_services', 'ACTIVO'),
    ('COLAPSO_ESTRUCTURAL', 'Colapso de edificaciones o infraestructura', 'domain_disabled', 'ACTIVO'),
    ('FUGA_GAS', 'Fugas de gas o sustancias peligrosas', 'gas_meter', 'ACTIVO'),
    ('OTROS', 'Otras emergencias no categorizadas', 'report_problem', 'ACTIVO');

insert into public.niveles_riesgo (nombre, color, descripcion) values
    ('BAJO', '#4CAF50', 'Situación de bajo riesgo, sin peligro inmediato'),
    ('MODERADO', '#FFC107', 'Situación de riesgo moderado, requiere atención'),
    ('ALTO', '#FF9800', 'Situación de alto riesgo, requiere acción inmediata'),
    ('CRITICO', '#F44336', 'Situación crítica, peligro extremo');

insert into public.estados_reporte (nombre, descripcion) values
    ('PENDIENTE', 'Reporte recibido, pendiente de revisión'),
    ('EN_REVISION', 'Reporte en proceso de revisión administrativa'),
    ('VERIFICADO', 'Reporte verificado por un administrador'),
    ('RECHAZADO', 'Reporte rechazado por un administrador'),
    ('ARCHIVADO', 'Reporte archivado');

insert into public.estados_alerta (nombre, descripcion) values
    ('ACTIVA', 'Alerta activa y visible para los usuarios'),
    ('EN_SEGUIMIENTO', 'Alerta bajo seguimiento activo'),
    ('CONTROLADA', 'Situación controlada, en observación'),
    ('FINALIZADA', 'Alerta finalizada, situación resuelta'),
    ('CANCELADA', 'Alerta cancelada');

insert into public.tipos_contacto (nombre, descripcion) values
    ('BOMBEROS', 'Cuerpo General de Bomberos Voluntarios del Perú'),
    ('POLICIA', 'Policía Nacional del Perú'),
    ('AMBULANCIA', 'Servicios de atención pre-hospitalaria y ambulancia'),
    ('DEFENSA_CIVIL', 'Instituto Nacional de Defensa Civil - INDECI'),
    ('SERENAZGO', 'Servicio de serenazgo municipal'),
    ('HOSPITAL', 'Centros hospitalarios y establecimientos de salud');

insert into public.contactos_emergencia (id_tipo_contacto, nombre_institucion, telefono, direccion, departamento, provincia, distrito, descripcion, estado) values
    (1, 'Central de Bomberos', '116', '', 'Lima', 'Lima', '', 'Línea nacional de emergencias - Bomberos', 'ACTIVO'),
    (1, 'Compañía de Bomberos Ate N° 126', '01-3511116', 'Av. Nicolás Ayllón cdra. 45', 'Lima', 'Lima', 'Ate', 'Compañía de bomberos del distrito de Ate', 'ACTIVO'),
    (2, 'Emergencias PNP', '105', '', 'Lima', 'Lima', '', 'Línea de emergencias de la Policía Nacional', 'ACTIVO'),
    (2, 'Comisaría PNP Ate', '01-3260530', 'Av. Nicolás Ayllón', 'Lima', 'Lima', 'Ate', 'Comisaría del distrito de Ate', 'ACTIVO'),
    (2, 'Comisaría PNP Santa Anita', '01-3621025', 'Av. Los Eucaliptos', 'Lima', 'Lima', 'Santa Anita', 'Comisaría del distrito de Santa Anita', 'ACTIVO'),
    (3, 'SAMU - Sistema de Atención Móvil de Urgencia', '106', '', 'Lima', 'Lima', '', 'Servicio de ambulancias del Ministerio de Salud', 'ACTIVO'),
    (4, 'INDECI', '115', 'Calle Ricardo Angulo 694, San Isidro', 'Lima', 'Lima', 'San Isidro', 'Instituto Nacional de Defensa Civil', 'ACTIVO'),
    (5, 'Serenazgo Ate', '01-4781212', 'Municipalidad de Ate', 'Lima', 'Lima', 'Ate', 'Central de serenazgo del distrito de Ate', 'ACTIVO'),
    (5, 'Serenazgo Santa Anita', '01-3621212', 'Municipalidad de Santa Anita', 'Lima', 'Lima', 'Santa Anita', 'Central de serenazgo de Santa Anita', 'ACTIVO'),
    (6, 'Hospital Vitarte', '01-3511444', 'Av. Nicolás Ayllón 5880', 'Lima', 'Lima', 'Ate', 'Hospital de Vitarte - MINSA', 'ACTIVO'),
    (6, 'Hospital Bravo Chico', '01-3620078', 'Av. Canto Grande', 'Lima', 'Lima', 'San Juan de Lurigancho', 'Hospital Bravo Chico', 'ACTIVO');

insert into public.categorias_prevencion (nombre, descripcion, imagen_url, estado) values
    ('SISMOS', 'Información preventiva ante movimientos sísmicos', null, 'ACTIVO'),
    ('INCENDIOS', 'Información preventiva ante incendios', null, 'ACTIVO'),
    ('INUNDACIONES', 'Información preventiva ante inundaciones y huaicos', null, 'ACTIVO'),
    ('PRIMEROS_AUXILIOS', 'Guía básica de primeros auxilios', null, 'ACTIVO'),
    ('SEGURIDAD_CIUDADANA', 'Recomendaciones de seguridad ciudadana', null, 'ACTIVO');

insert into public.informacion_prevencion (id_categoria_prevencion, titulo, antes, durante, despues, fecha_actualizacion) values
    (1, '¿Qué hacer ante un sismo?',
     'Identifica las zonas seguras de tu hogar y centro de trabajo. Prepara una mochila de emergencia con agua, linterna, botiquín, documentos y radio a pilas. Participa activamente en simulacros. Asegura muebles pesados y objetos que puedan caer. Establece un punto de encuentro familiar.',
     'Mantén la calma y no corras. Ubícate en la zona segura identificada (columnas, vigas, marcos de puertas). Si estás en un edificio, aléjate de ventanas y objetos que puedan caer. Si estás en la calle, aléjate de postes, cables y edificios. Protege tu cabeza con los brazos o un objeto resistente.',
     'Revisa si hay daños estructurales en tu vivienda antes de ingresar. No uses ascensores. Verifica que no haya fugas de gas o cortocircuitos. Atiende a personas heridas si puedes hacerlo con seguridad. Mantente informado por fuentes oficiales. Ten cuidado con las réplicas.',
     '2026-09-26 11:35:36-05'),
    (2, '¿Qué hacer ante un incendio?',
     'Instala detectores de humo en tu hogar. Ten un extintor vigente y aprende a usarlo. Conoce las rutas de evacuación. No sobrecargues las tomas de corriente. Revisa periódicamente las instalaciones eléctricas y de gas. Almacena productos inflamables de forma segura.',
     'Llama inmediatamente a los bomberos (116). Sal del lugar agachado para evitar el humo. Cubre tu nariz y boca con un paño húmedo. No uses ascensores. Toca las puertas antes de abrirlas: si están calientes, no las abras. Si tu ropa se incendia, tírate al piso y rueda.',
     'No regreses al lugar hasta que los bomberos lo autoricen. Ventila los ambientes afectados. Revisa las instalaciones antes de reconectar servicios. Documenta los daños para el seguro. Busca apoyo emocional si lo necesitas.',
     '2026-09-26 11:35:36-05'),
    (3, '¿Qué hacer ante una inundación?',
     'No construyas ni habites en zonas inundables o cauces de ríos. Limpia periódicamente desagües, canaletas y alcantarillas. Prepara una mochila de emergencia. Identifica las zonas altas y rutas de evacuación de tu zona. Mantente informado sobre alertas meteorológicas.',
     'Corta inmediatamente la energía eléctrica. Dirígete a zonas altas. No camines ni conduzcas por aguas turbulentas. Aléjate de ríos, quebradas y cauces. No intentes cruzar puentes sobre ríos crecidos. Lleva contigo a tus mascotas si es seguro hacerlo.',
     'Desinfecta el agua antes de consumirla. No consumas alimentos que hayan estado en contacto con el agua. Revisa las instalaciones eléctricas antes de reconectar. Limpia y desinfecta tu vivienda. Reporta daños a las autoridades. Cuídate de enfermedades transmitidas por el agua.',
     '2026-09-26 11:35:36-05'),
    (4, '¿Cómo actuar en primeros auxilios?',
     'Toma un curso básico de primeros auxilios. Ten un botiquín de emergencia en casa, trabajo y auto. Aprende las maniobras de RCP básico. Conoce los números de emergencia (106 - SAMU, 116 - Bomberos, 105 - PNP). Identifica alergias y condiciones médicas de tu familia.',
     'Evalúa la seguridad de la escena antes de actuar. Llama a los servicios de emergencia. No muevas a la víctima a menos que esté en peligro inmediato. Controla hemorragias con presión directa. Mantén abrigada a la víctima. No administres medicamentos sin conocimiento.',
     'Mantén a la víctima estable hasta que llegue la ayuda profesional. Proporciona información clara al personal de emergencia. Acompaña a la víctima al centro de salud si es necesario. Registra los datos del incidente para el seguimiento médico.',
     '2026-09-26 11:35:36-05'),
    (5, '¿Cómo prevenir situaciones de inseguridad?',
     'Evita caminar solo por zonas oscuras o desoladas. No exhibas objetos de valor en la vía pública. Varía tus rutas y horarios habituales. Mantén comunicación constante con familiares. Guarda los números de serenazgo y comisaría de tu zona. Conoce a tus vecinos y organiza juntas vecinales.',
     'Mantén la calma y no opongas resistencia física. Observa y memoriza las características del agresor. Busca ayuda gritando o usando un silbato. Dirígete a un lugar con personas. Llama al 105 (PNP) o al serenazgo de tu distrito.',
     'Realiza la denuncia en la comisaría más cercana. Busca atención médica si fuiste agredido. Guarda toda evidencia posible. Solicita apoyo psicológico si lo necesitas. Comparte la información con tu comunidad para alertar a otros.',
     '2026-09-26 11:35:36-05');
