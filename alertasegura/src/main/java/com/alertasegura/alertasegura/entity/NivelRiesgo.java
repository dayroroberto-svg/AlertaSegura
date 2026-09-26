package com.alertasegura.alertasegura.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "niveles_riesgo")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class NivelRiesgo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_nivel")
    private Long idNivel;

    @Column(name = "nombre", nullable = false, unique = true, length = 50)
    private String nombre;

    @Column(name = "color", length = 20)
    private String color;

    @Column(name = "descripcion")
    private String descripcion;
}
