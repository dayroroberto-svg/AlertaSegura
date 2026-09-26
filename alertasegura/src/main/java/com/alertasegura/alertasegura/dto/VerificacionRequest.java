package com.alertasegura.alertasegura.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class VerificacionRequest {
    
    @NotNull(message = "El id del reporte es obligatorio")
    private Long idReporte;

    @NotBlank(message = "El resultado es obligatorio (VERIFICADO o RECHAZADO)")
    private String resultado;

    private String comentarios;
}
