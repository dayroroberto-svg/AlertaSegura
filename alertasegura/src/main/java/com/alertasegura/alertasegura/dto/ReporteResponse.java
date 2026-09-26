package com.alertasegura.alertasegura.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ReporteResponse {
    private Long idReporte;
    private String codigoReporte;
    private String titulo;
    private String descripcion;
    private String categoria;
    private String nivelRiesgo;
    private String estadoReporte;
    private String usuario;
    private String distrito;
    private String direccion;
    private LocalDateTime fechaIncidente;
    private LocalDateTime fechaReporte;
    private String evidenciaUrl;
    private String observacionesAdmin;
}
