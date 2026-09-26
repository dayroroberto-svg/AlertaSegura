package com.alertasegura.alertasegura.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "estados_reporte")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class EstadoReporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estado")
    private Long idEstado;

    @Column(name = "nombre", nullable = false, unique = true, length = 50)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;
}
