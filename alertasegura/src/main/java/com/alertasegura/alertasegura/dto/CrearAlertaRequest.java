package com.alertasegura.alertasegura.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CrearAlertaRequest {
    
    private Long idReporte;

    @NotNull(message = "La categoría es obligatoria")
    private Long idCategoria;

    @NotNull(message = "El nivel de riesgo es obligatorio")
    private Long idNivel;
    
    @NotBlank(message = "El estado inicial es obligatorio")
    private String estadoAlerta;

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 200, message = "El título no puede exceder 200 caracteres")
    private String titulo;

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;
    
    private String recomendaciones;

    @NotNull(message = "La ubicación es obligatoria")
    @Valid
    private UbicacionRequest ubicacion;
}
