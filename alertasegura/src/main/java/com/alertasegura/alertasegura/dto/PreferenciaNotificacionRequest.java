package com.alertasegura.alertasegura.dto;

import jakarta.validation.constraints.NotNull;
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
    private BigDecimal radioKm;
}
