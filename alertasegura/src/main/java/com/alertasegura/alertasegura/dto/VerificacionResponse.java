package com.alertasegura.alertasegura.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class VerificacionResponse {
    private Long idVerificacion;
    private Long idReporte;
    private String codigoReporte;
    private String administrador;
    private String resultado;
    private String comentarios;
    private LocalDateTime fechaVerificacion;
}
