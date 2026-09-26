package com.alertasegura.alertasegura.service;

import com.alertasegura.alertasegura.dto.ContactoEmergenciaResponse;
import com.alertasegura.alertasegura.entity.ContactoEmergencia;
import com.alertasegura.alertasegura.repository.ContactoEmergenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactoEmergenciaService {

    @Autowired
    private ContactoEmergenciaRepository contactoRepository;

    public List<ContactoEmergenciaResponse> obtenerActivos() {
        return contactoRepository.findByEstado(ContactoEmergencia.EstadoContacto.ACTIVO)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private ContactoEmergenciaResponse mapToResponse(ContactoEmergencia contacto) {
        return ContactoEmergenciaResponse.builder()
                .idContacto(contacto.getIdContacto())
                .tipoContacto(contacto.getTipoContacto().getNombre())
                .nombreInstitucion(contacto.getNombreInstitucion())
                .telefono(contacto.getTelefono())
                .direccion(contacto.getDireccion())
                .distrito(contacto.getDistrito())
                .descripcion(contacto.getDescripcion())
                .build();
    }
}
