package com.alertasegura.alertasegura.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CrearReporteRequest {

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 200, message = "El título no puede exceder 200 caracteres")
    private String titulo;

    private String descripcion;

    @NotNull(message = "La categoría es obligatoria")
    private Long idCategoria;

    @NotNull(message = "El nivel de riesgo es obligatorio")
    private Long idNivel;

    @NotNull(message = "La ubicación es obligatoria")
    @Valid
    private UbicacionRequest ubicacion;

    private LocalDateTime fechaIncidente;

    @Size(max = 500)
    private String evidenciaUrl;
}
