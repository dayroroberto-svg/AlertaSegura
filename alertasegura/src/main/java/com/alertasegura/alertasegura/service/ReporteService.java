package com.alertasegura.alertasegura.service;

import com.alertasegura.alertasegura.dto.CrearReporteRequest;
import com.alertasegura.alertasegura.dto.ReporteResponse;
import com.alertasegura.alertasegura.entity.*;
import com.alertasegura.alertasegura.exception.ResourceNotFoundException;
import com.alertasegura.alertasegura.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReporteService {

    @Autowired
    private ReporteRepository reporteRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private CategoriaEmergenciaRepository categoriaRepository;
    
    @Autowired
    private NivelRiesgoRepository nivelRiesgoRepository;
    
    @Autowired
    private EstadoReporteRepository estadoRepository;
    
    @Autowired
    private UbicacionRepository ubicacionRepository;

    @Transactional
    public ReporteResponse crearReporte(CrearReporteRequest request, String correoUsuario) {
        Usuario usuario = usuarioRepository.findByCorreo(correoUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
                
        CategoriaEmergencia categoria = categoriaRepository.findById(request.getIdCategoria())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));
                
        NivelRiesgo nivel = nivelRiesgoRepository.findById(request.getIdNivel())
                .orElseThrow(() -> new ResourceNotFoundException("Nivel de riesgo no encontrado"));
                
        EstadoReporte estadoInicial = estadoRepository.findByNombre("PENDIENTE")
                .orElseThrow(() -> new ResourceNotFoundException("Estado PENDIENTE no encontrado"));

        Ubicacion ubicacion = Ubicacion.builder()
                .departamento(request.getUbicacion().getDepartamento())
                .provincia(request.getUbicacion().getProvincia())
                .distrito(request.getUbicacion().getDistrito())
                .direccion(request.getUbicacion().getDireccion())
                .latitud(request.getUbicacion().getLatitud())
                .longitud(request.getUbicacion().getLongitud())
                .referencia(request.getUbicacion().getReferencia())
                .build();
        
        ubicacion = ubicacionRepository.save(ubicacion);

        String codigoUnico = "REP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Reporte reporte = Reporte.builder()
                .codigoReporte(codigoUnico)
                .usuario(usuario)
                .categoria(categoria)
                .nivelRiesgo(nivel)
                .estadoReporte(estadoInicial)
                .ubicacion(ubicacion)
                .titulo(request.getTitulo())
                .descripcion(request.getDescripcion())
                .fechaIncidente(request.getFechaIncidente())
                .evidenciaUrl(request.getEvidenciaUrl())
                .build();

        reporte = reporteRepository.save(reporte);
        return mapToResponse(reporte);
    }

    public List<ReporteResponse> obtenerTodos() {
        return reporteRepository.findAllByOrderByFechaReporteDesc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ReporteResponse obtenerPorId(Long id) {
        Reporte reporte = reporteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reporte no encontrado"));
        return mapToResponse(reporte);
    }
    
    public List<ReporteResponse> obtenerPorUsuario(String correoUsuario) {
        Usuario usuario = usuarioRepository.findByCorreo(correoUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return reporteRepository.findByUsuarioIdUsuarioOrderByFechaReporteDesc(usuario.getIdUsuario())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private ReporteResponse mapToResponse(Reporte reporte) {
        return ReporteResponse.builder()
                .idReporte(reporte.getIdReporte())
                .codigoReporte(reporte.getCodigoReporte())
                .titulo(reporte.getTitulo())
                .descripcion(reporte.getDescripcion())
                .categoria(reporte.getCategoria().getNombre())
                .nivelRiesgo(reporte.getNivelRiesgo().getNombre())
                .estadoReporte(reporte.getEstadoReporte().getNombre())
                .usuario(reporte.getUsuario().getNombres() + " " + reporte.getUsuario().getApellidos())
                .distrito(reporte.getUbicacion().getDistrito())
                .direccion(reporte.getUbicacion().getDireccion())
                .fechaIncidente(reporte.getFechaIncidente())
                .fechaReporte(reporte.getFechaReporte())
                .evidenciaUrl(reporte.getEvidenciaUrl())
                .observacionesAdmin(reporte.getObservacionesAdmin())
                .build();
    }
}
