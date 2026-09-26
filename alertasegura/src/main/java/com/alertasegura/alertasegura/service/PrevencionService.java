package com.alertasegura.alertasegura.service;

import com.alertasegura.alertasegura.dto.InformacionPrevencionResponse;
import com.alertasegura.alertasegura.entity.InformacionPrevencion;
import com.alertasegura.alertasegura.repository.InformacionPrevencionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrevencionService {

    @Autowired
    private InformacionPrevencionRepository prevencionRepository;

    public List<InformacionPrevencionResponse> obtenerTodas() {
        return prevencionRepository.findAll()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private InformacionPrevencionResponse mapToResponse(InformacionPrevencion info) {
        return InformacionPrevencionResponse.builder()
                .idInformacion(info.getIdInformacion())
                .categoria(info.getCategoriaPrevencion().getNombre())
                .titulo(info.getTitulo())
                .antes(info.getAntes())
                .durante(info.getDurante())
                .despues(info.getDespues())
                .fechaActualizacion(info.getFechaActualizacion())
                .build();
    }
}
