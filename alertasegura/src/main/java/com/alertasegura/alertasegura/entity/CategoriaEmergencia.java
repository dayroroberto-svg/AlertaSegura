package com.alertasegura.alertasegura.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categorias_emergencia")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CategoriaEmergencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Long idCategoria;

    @Column(name = "nombre", nullable = false, unique = true, length = 100)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "icono", length = 100)
    private String icono;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoCategoria estado = EstadoCategoria.ACTIVO;

    public enum EstadoCategoria {
        ACTIVO, INACTIVO
    }
}
