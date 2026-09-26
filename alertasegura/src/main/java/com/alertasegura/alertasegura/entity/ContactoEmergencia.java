package com.alertasegura.alertasegura.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "contactos_emergencia")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ContactoEmergencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_contacto")
    private Long idContacto;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_tipo_contacto", nullable = false)
    private TipoContacto tipoContacto;

    @Column(name = "nombre_institucion", nullable = false, length = 200)
    private String nombreInstitucion;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "departamento", length = 100)
    private String departamento;

    @Column(name = "provincia", length = 100)
    private String provincia;

    @Column(name = "distrito", length = 100)
    private String distrito;

    @Column(name = "descripcion", length = 500)
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoContacto estado = EstadoContacto.ACTIVO;

    public enum EstadoContacto {
        ACTIVO, INACTIVO
    }
}
