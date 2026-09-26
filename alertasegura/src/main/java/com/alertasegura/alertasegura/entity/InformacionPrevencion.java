package com.alertasegura.alertasegura.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "informacion_prevencion")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class InformacionPrevencion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_informacion")
    private Long idInformacion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_categoria_prevencion", nullable = false)
    private CategoriaPrevencion categoriaPrevencion;

    @Column(name = "titulo", nullable = false, length = 200)
    private String titulo;

    @Column(name = "antes", columnDefinition = "TEXT")
    private String antes;

    @Column(name = "durante", columnDefinition = "TEXT")
    private String durante;

    @Column(name = "despues", columnDefinition = "TEXT")
    private String despues;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.fechaActualizacion = LocalDateTime.now();
    }
}
