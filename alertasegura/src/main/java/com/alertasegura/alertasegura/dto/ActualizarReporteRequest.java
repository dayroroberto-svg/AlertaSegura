package com.alertasegura.alertasegura.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ActualizarReporteRequest {

    @NotBlank(message = "El estado es obligatorio")
    private String estadoReporte;

    private String observacionesAdmin;
}
