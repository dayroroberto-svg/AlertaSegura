package com.alertasegura.alertasegura.service;

import com.alertasegura.alertasegura.dto.AlertaResponse;
import com.alertasegura.alertasegura.entity.Alerta;
import com.alertasegura.alertasegura.exception.ResourceNotFoundException;
import com.alertasegura.alertasegura.repository.AlertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertaService {

    @Autowired
    private AlertaRepository alertaRepository;

    public List<AlertaResponse> obtenerTodasActivas() {
        return alertaRepository.findByEstadoAlertaNombreNotOrderByFechaPublicacionDesc("FINALIZADA")
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public AlertaResponse obtenerPorId(Long id) {
        Alerta alerta = alertaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alerta no encontrada"));
        return mapToResponse(alerta);
    }

    private AlertaResponse mapToResponse(Alerta alerta) {
        return AlertaResponse.builder()
                .idAlerta(alerta.getIdAlerta())
                .codigoAlerta(alerta.getCodigoAlerta())
                .titulo(alerta.getTitulo())
                .descripcion(alerta.getDescripcion())
                .recomendaciones(alerta.getRecomendaciones())
                .categoria(alerta.getCategoria().getNombre())
                .nivelRiesgo(alerta.getNivelRiesgo().getNombre())
                .colorRiesgo(alerta.getNivelRiesgo().getColor())
                .estadoAlerta(alerta.getEstadoAlerta().getNombre())
                .distrito(alerta.getUbicacion().getDistrito())
                .direccion(alerta.getUbicacion().getDireccion())
                .latitud(alerta.getUbicacion().getLatitud())
                .longitud(alerta.getUbicacion().getLongitud())
                .fechaPublicacion(alerta.getFechaPublicacion())
                .fechaActualizacion(alerta.getFechaActualizacion())
                .fechaFinalizacion(alerta.getFechaFinalizacion())
                .build();
    }
}
