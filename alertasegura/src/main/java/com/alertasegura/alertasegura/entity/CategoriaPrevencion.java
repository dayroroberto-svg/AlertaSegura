package com.alertasegura.alertasegura.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categorias_prevencion")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CategoriaPrevencion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria_prevencion")
    private Long idCategoriaPrevencion;

    @Column(name = "nombre", nullable = false, unique = true, length = 100)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoCategoriaPrevencion estado = EstadoCategoriaPrevencion.ACTIVO;

    public enum EstadoCategoriaPrevencion {
        ACTIVO, INACTIVO
    }
}
