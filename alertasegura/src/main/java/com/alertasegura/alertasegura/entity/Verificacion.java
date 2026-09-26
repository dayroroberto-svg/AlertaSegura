package com.alertasegura.alertasegura.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verificaciones")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Verificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_verificacion")
    private Long idVerificacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_reporte", nullable = false)
    private Reporte reporte;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_administrador", nullable = false)
    private Usuario administrador;

    @Enumerated(EnumType.STRING)
    @Column(name = "resultado", nullable = false)
    private ResultadoVerificacion resultado;

    @Column(name = "comentarios", columnDefinition = "TEXT")
    private String comentarios;

    @Column(name = "fecha_verificacion", nullable = false, updatable = false)
    private LocalDateTime fechaVerificacion;

    public enum ResultadoVerificacion {
        VERIFICADO, RECHAZADO
    }

    @PrePersist
    protected void onCreate() {
        this.fechaVerificacion = LocalDateTime.now();
    }
}
