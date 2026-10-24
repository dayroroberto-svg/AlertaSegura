package com.alertasegura.alertasegura.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PreferenciaNotificacionRequest {

    @NotNull
    private Boolean recibirAlertas;

    @NotNull
    private Boolean recibirReportes;

    @NotNull
    private Boolean recibirPrevencion;

    @NotNull
    @DecimalMin(value = "0.01", message = "El radio debe ser mayor que cero")
    @DecimalMax(value = "999.99", message = "El radio no puede exceder 999.99 km")
    private BigDecimal radioKm;
}
