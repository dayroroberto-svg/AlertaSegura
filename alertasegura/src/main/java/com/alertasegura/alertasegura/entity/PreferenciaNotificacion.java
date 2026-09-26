package com.alertasegura.alertasegura.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "preferencias_notificacion")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PreferenciaNotificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_preferencia")
    private Long idPreferencia;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "recibir_alertas", nullable = false)
    private Boolean recibirAlertas = true;

    @Column(name = "recibir_reportes", nullable = false)
    private Boolean recibirReportes = true;

    @Column(name = "recibir_prevencion", nullable = false)
    private Boolean recibirPrevencion = true;

    @Column(name = "radio_km", precision = 5, scale = 2)
    private BigDecimal radioKm = new BigDecimal("10.00");
}
