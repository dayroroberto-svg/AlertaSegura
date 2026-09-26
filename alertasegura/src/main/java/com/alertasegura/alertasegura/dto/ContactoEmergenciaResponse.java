package com.alertasegura.alertasegura.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ContactoEmergenciaResponse {
    private Long idContacto;
    private String tipoContacto;
    private String nombreInstitucion;
    private String telefono;
    private String direccion;
    private String distrito;
    private String descripcion;
}
