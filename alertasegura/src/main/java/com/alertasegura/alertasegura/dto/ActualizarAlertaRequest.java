package com.alertasegura.alertasegura.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ActualizarAlertaRequest {

    @NotBlank(message = "El estado de la alerta es obligatorio")
    private String estadoAlerta;
    
    private String descripcion;
    private String recomendaciones;
    private String comentarioHistorial;
}
