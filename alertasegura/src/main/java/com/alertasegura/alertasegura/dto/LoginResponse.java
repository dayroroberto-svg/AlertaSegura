package com.alertasegura.alertasegura.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private String tipo;
    private Long idUsuario;
    private String nombres;
    private String apellidos;
    private String correo;
    private String rol;
}
