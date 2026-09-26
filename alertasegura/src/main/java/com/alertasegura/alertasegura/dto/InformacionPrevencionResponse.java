package com.alertasegura.alertasegura.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class InformacionPrevencionResponse {
    private Long idInformacion;
    private String categoria;
    private String titulo;
    private String antes;
    private String durante;
    private String despues;
    private LocalDateTime fechaActualizacion;
}
