package com.alertasegura.alertasegura.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AlertaResponse {
    private Long idAlerta;
    private String codigoAlerta;
    private String titulo;
    private String descripcion;
    private String recomendaciones;
    private String categoria;
    private String nivelRiesgo;
    private String colorRiesgo;
    private String estadoAlerta;
    private String distrito;
    private String direccion;
    private BigDecimal latitud;
    private BigDecimal longitud;
    private LocalDateTime fechaPublicacion;
    private LocalDateTime fechaActualizacion;
    private LocalDateTime fechaFinalizacion;
}
