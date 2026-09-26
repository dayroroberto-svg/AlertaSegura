-- ============================================================
-- ALERTASEGURA - ESQUEMA DE BASE DE DATOS
-- MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS alertasegura
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE alertasegura;

-- ============================================================
-- 1. ROLES
-- ============================================================
CREATE TABLE roles (
    id_rol BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. USUARIOS
-- ============================================================
CREATE TABLE usuarios (
    id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_rol BIGINT NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    estado ENUM('ACTIVO', 'INACTIVO', 'BLOQUEADO') NOT NULL DEFAULT 'ACTIVO',
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultima_conexion DATETIME,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_usuario_correo ON usuarios(correo);
CREATE INDEX idx_usuario_estado ON usuarios(estado);

-- ============================================================
-- 3. UBICACIONES
-- ============================================================
CREATE TABLE ubicaciones (
    id_ubicacion BIGINT AUTO_INCREMENT PRIMARY KEY,
    departamento VARCHAR(100),
    provincia VARCHAR(100),
    distrito VARCHAR(100),
    direccion VARCHAR(255),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    referencia VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_ubicacion_distrito ON ubicaciones(distrito);
CREATE INDEX idx_ubicacion_coords ON ubicaciones(latitud, longitud);

-- ============================================================
-- 4. CATEGORÍAS DE EMERGENCIA
-- ============================================================
CREATE TABLE categorias_emergencia (
    id_categoria BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    icono VARCHAR(100),
    estado ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. NIVELES DE RIESGO
-- ============================================================
CREATE TABLE niveles_riesgo (
    id_nivel BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(20),
    descripcion VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. ESTADOS DE REPORTE
-- ============================================================
CREATE TABLE estados_reporte (
    id_estado BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. REPORTES
-- ============================================================
CREATE TABLE reportes (
    id_reporte BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo_reporte VARCHAR(20) NOT NULL UNIQUE,
    id_usuario BIGINT NOT NULL,
    id_categoria BIGINT NOT NULL,
    id_ubicacion BIGINT NOT NULL,
    id_nivel BIGINT NOT NULL,
    id_estado BIGINT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fecha_incidente DATETIME,
    fecha_reporte DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    evidencia_url VARCHAR(500),
    observaciones_admin TEXT,
    CONSTRAINT fk_reporte_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_reporte_categoria FOREIGN KEY (id_categoria) REFERENCES categorias_emergencia(id_categoria),
    CONSTRAINT fk_reporte_ubicacion FOREIGN KEY (id_ubicacion) REFERENCES ubicaciones(id_ubicacion),
    CONSTRAINT fk_reporte_nivel FOREIGN KEY (id_nivel) REFERENCES niveles_riesgo(id_nivel),
    CONSTRAINT fk_reporte_estado FOREIGN KEY (id_estado) REFERENCES estados_reporte(id_estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_reporte_codigo ON reportes(codigo_reporte);
CREATE INDEX idx_reporte_usuario ON reportes(id_usuario);
CREATE INDEX idx_reporte_estado ON reportes(id_estado);
CREATE INDEX idx_reporte_fecha ON reportes(fecha_reporte);

-- ============================================================
-- 8. VERIFICACIONES
-- ============================================================
CREATE TABLE verificaciones (
    id_verificacion BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_reporte BIGINT NOT NULL,
    id_administrador BIGINT NOT NULL,
    resultado ENUM('VERIFICADO', 'RECHAZADO') NOT NULL,
    comentarios TEXT,
    fecha_verificacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_verificacion_reporte FOREIGN KEY (id_reporte) REFERENCES reportes(id_reporte),
    CONSTRAINT fk_verificacion_admin FOREIGN KEY (id_administrador) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_verificacion_reporte ON verificaciones(id_reporte);

-- ============================================================
-- 9. ESTADOS DE ALERTA
-- ============================================================
CREATE TABLE estados_alerta (
    id_estado_alerta BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. ALERTAS
-- ============================================================
CREATE TABLE alertas (
    id_alerta BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo_alerta VARCHAR(20) NOT NULL UNIQUE,
    id_reporte BIGINT,
    id_administrador BIGINT NOT NULL,
    id_categoria BIGINT NOT NULL,
    id_ubicacion BIGINT NOT NULL,
    id_nivel BIGINT NOT NULL,
    id_estado_alerta BIGINT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    recomendaciones TEXT,
    fecha_publicacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME,
    fecha_finalizacion DATETIME,
    CONSTRAINT fk_alerta_reporte FOREIGN KEY (id_reporte) REFERENCES reportes(id_reporte),
    CONSTRAINT fk_alerta_admin FOREIGN KEY (id_administrador) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_alerta_categoria FOREIGN KEY (id_categoria) REFERENCES categorias_emergencia(id_categoria),
    CONSTRAINT fk_alerta_ubicacion FOREIGN KEY (id_ubicacion) REFERENCES ubicaciones(id_ubicacion),
    CONSTRAINT fk_alerta_nivel FOREIGN KEY (id_nivel) REFERENCES niveles_riesgo(id_nivel),
    CONSTRAINT fk_alerta_estado FOREIGN KEY (id_estado_alerta) REFERENCES estados_alerta(id_estado_alerta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_alerta_codigo ON alertas(codigo_alerta);
CREATE INDEX idx_alerta_estado ON alertas(id_estado_alerta);
CREATE INDEX idx_alerta_fecha ON alertas(fecha_publicacion);

-- ============================================================
-- 11. HISTORIAL DE ALERTAS
-- ============================================================
CREATE TABLE historial_alertas (
    id_historial BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_alerta BIGINT NOT NULL,
    id_usuario BIGINT NOT NULL,
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50) NOT NULL,
    comentario TEXT,
    fecha_cambio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_historial_alerta FOREIGN KEY (id_alerta) REFERENCES alertas(id_alerta),
    CONSTRAINT fk_historial_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_historial_alerta ON historial_alertas(id_alerta);

-- ============================================================
-- 12. NOTIFICACIONES
-- ============================================================
CREATE TABLE notificaciones (
    id_notificacion BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    id_alerta BIGINT,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT,
    tipo ENUM('ALERTA', 'REPORTE', 'SISTEMA') NOT NULL,
    leida BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_envio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notificacion_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_notificacion_alerta FOREIGN KEY (id_alerta) REFERENCES alertas(id_alerta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_notificacion_usuario ON notificaciones(id_usuario);
CREATE INDEX idx_notificacion_leida ON notificaciones(id_usuario, leida);

-- ============================================================
-- 13. PREFERENCIAS DE NOTIFICACIÓN
-- ============================================================
CREATE TABLE preferencias_notificacion (
    id_preferencia BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL UNIQUE,
    recibir_alertas BOOLEAN NOT NULL DEFAULT TRUE,
    recibir_reportes BOOLEAN NOT NULL DEFAULT TRUE,
    recibir_prevencion BOOLEAN NOT NULL DEFAULT TRUE,
    radio_km DECIMAL(5, 2) DEFAULT 10.00,
    CONSTRAINT fk_preferencia_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 14. TIPOS DE CONTACTO
-- ============================================================
CREATE TABLE tipos_contacto (
    id_tipo_contacto BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 15. CONTACTOS DE EMERGENCIA
-- ============================================================
CREATE TABLE contactos_emergencia (
    id_contacto BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_tipo_contacto BIGINT NOT NULL,
    nombre_institucion VARCHAR(200) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    departamento VARCHAR(100),
    provincia VARCHAR(100),
    distrito VARCHAR(100),
    descripcion VARCHAR(500),
    estado ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    CONSTRAINT fk_contacto_tipo FOREIGN KEY (id_tipo_contacto) REFERENCES tipos_contacto(id_tipo_contacto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_contacto_estado ON contactos_emergencia(estado);

-- ============================================================
-- 16. CATEGORÍAS DE PREVENCIÓN
-- ============================================================
CREATE TABLE categorias_prevencion (
    id_categoria_prevencion BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    imagen_url VARCHAR(500),
    estado ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 17. INFORMACIÓN PREVENTIVA
-- ============================================================
CREATE TABLE informacion_prevencion (
    id_informacion BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_categoria_prevencion BIGINT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    antes TEXT,
    durante TEXT,
    despues TEXT,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_info_categoria FOREIGN KEY (id_categoria_prevencion) REFERENCES categorias_prevencion(id_categoria_prevencion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 18. AUDITORÍA
-- ============================================================
CREATE TABLE auditoria (
    id_auditoria BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    accion VARCHAR(100) NOT NULL,
    tabla_afectada VARCHAR(100),
    id_registro BIGINT,
    descripcion TEXT,
    fecha_accion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_auditoria_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_auditoria_usuario ON auditoria(id_usuario);
CREATE INDEX idx_auditoria_fecha ON auditoria(fecha_accion);
CREATE INDEX idx_auditoria_tabla ON auditoria(tabla_afectada);
