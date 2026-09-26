package com.alertasegura.alertasegura.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class UbicacionRequest {

    @Size(max = 100)
    private String departamento;

    @Size(max = 100)
    private String provincia;

    @Size(max = 100)
    private String distrito;

    private String direccion;

    @DecimalMin(value = "-90.0", message = "Latitud mínima: -90")
    @DecimalMax(value = "90.0", message = "Latitud máxima: 90")
    private BigDecimal latitud;

    @DecimalMin(value = "-180.0", message = "Longitud mínima: -180")
    @DecimalMax(value = "180.0", message = "Longitud máxima: 180")
    private BigDecimal longitud;

    private String referencia;
}
