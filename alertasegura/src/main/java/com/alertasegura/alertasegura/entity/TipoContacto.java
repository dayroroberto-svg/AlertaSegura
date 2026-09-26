package com.alertasegura.alertasegura.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tipos_contacto")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TipoContacto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_contacto")
    private Long idTipoContacto;

    @Column(name = "nombre", nullable = false, unique = true, length = 100)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;
}
