-- Alinea la tabla ubicaciones con database/schema.sql.
-- El esquema documentado define departamento, provincia y distrito como opcionales,
-- pero algunas bases de datos creadas con versiones anteriores los tienen NOT NULL.
-- Sin esta corrección, POST /api/reportes falla cuando el ciudadano no envía esos campos.

ALTER TABLE ubicaciones
    MODIFY COLUMN departamento VARCHAR(100) NULL,
    MODIFY COLUMN provincia VARCHAR(100) NULL,
    MODIFY COLUMN distrito VARCHAR(100) NULL;
