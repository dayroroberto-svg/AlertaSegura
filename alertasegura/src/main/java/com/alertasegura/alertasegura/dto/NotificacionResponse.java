package com.alertasegura.alertasegura.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class NotificacionResponse {
    private Long idNotificacion;
    private String titulo;
    private String mensaje;
    private String tipo;
    private Boolean leida;
    private LocalDateTime fechaEnvio;
    private Long idAlerta;
}
