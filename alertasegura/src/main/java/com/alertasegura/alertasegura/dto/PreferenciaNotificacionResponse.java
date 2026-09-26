package com.alertasegura.alertasegura.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PreferenciaNotificacionResponse {
    private Boolean recibirAlertas;
    private Boolean recibirReportes;
    private Boolean recibirPrevencion;
    private BigDecimal radioKm;
}
