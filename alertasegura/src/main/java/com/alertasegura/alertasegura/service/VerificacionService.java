package com.alertasegura.alertasegura.service;

import com.alertasegura.alertasegura.dto.VerificacionRequest;
import com.alertasegura.alertasegura.dto.VerificacionResponse;
import com.alertasegura.alertasegura.entity.Reporte;
import com.alertasegura.alertasegura.entity.Usuario;
import com.alertasegura.alertasegura.entity.Verificacion;
import com.alertasegura.alertasegura.entity.EstadoReporte;
import com.alertasegura.alertasegura.exception.ResourceNotFoundException;
import com.alertasegura.alertasegura.repository.EstadoReporteRepository;
import com.alertasegura.alertasegura.repository.ReporteRepository;
import com.alertasegura.alertasegura.repository.UsuarioRepository;
import com.alertasegura.alertasegura.repository.VerificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VerificacionService {

    @Autowired
    private VerificacionRepository verificacionRepository;

    @Autowired
    private ReporteRepository reporteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EstadoReporteRepository estadoReporteRepository;

    @Transactional
    public VerificacionResponse verificar(VerificacionRequest request, String correoAdmin) {
        Usuario admin = usuarioRepository.findByCorreo(correoAdmin)
                .orElseThrow(() -> new ResourceNotFoundException("Administrador no encontrado"));

        Reporte reporte = reporteRepository.findById(request.getIdReporte())
                .orElseThrow(() -> new ResourceNotFoundException("Reporte no encontrado"));

        Verificacion.ResultadoVerificacion resultado = Verificacion.ResultadoVerificacion.valueOf(request.getResultado().toUpperCase());

        Verificacion verificacion = Verificacion.builder()
                .reporte(reporte)
                .administrador(admin)
                .resultado(resultado)
                .comentarios(request.getComentarios())
                .build();

        verificacion = verificacionRepository.save(verificacion);

        // Update Report status
        String nuevoEstadoNombre = resultado == Verificacion.ResultadoVerificacion.VERIFICADO ? "VERIFICADO" : "RECHAZADO";
        EstadoReporte nuevoEstado = estadoReporteRepository.findByNombre(nuevoEstadoNombre)
                .orElseThrow(() -> new ResourceNotFoundException("Estado " + nuevoEstadoNombre + " no encontrado"));
        
        reporte.setEstadoReporte(nuevoEstado);
        reporte.setObservacionesAdmin(request.getComentarios());
        reporteRepository.save(reporte);

        return mapToResponse(verificacion);
    }

    public List<VerificacionResponse> obtenerPorReporte(Long idReporte) {
        return verificacionRepository.findByReporteIdReporte(idReporte)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private VerificacionResponse mapToResponse(Verificacion verificacion) {
        return VerificacionResponse.builder()
                .idVerificacion(verificacion.getIdVerificacion())
                .idReporte(verificacion.getReporte().getIdReporte())
                .codigoReporte(verificacion.getReporte().getCodigoReporte())
                .administrador(verificacion.getAdministrador().getNombres() + " " + verificacion.getAdministrador().getApellidos())
                .resultado(verificacion.getResultado().name())
                .comentarios(verificacion.getComentarios())
                .fechaVerificacion(verificacion.getFechaVerificacion())
                .build();
    }
}
