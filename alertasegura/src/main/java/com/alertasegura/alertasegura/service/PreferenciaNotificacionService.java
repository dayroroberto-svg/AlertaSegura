package com.alertasegura.alertasegura.service;

import com.alertasegura.alertasegura.dto.PreferenciaNotificacionRequest;
import com.alertasegura.alertasegura.dto.PreferenciaNotificacionResponse;
import com.alertasegura.alertasegura.entity.PreferenciaNotificacion;
import com.alertasegura.alertasegura.entity.Usuario;
import com.alertasegura.alertasegura.exception.ResourceNotFoundException;
import com.alertasegura.alertasegura.repository.PreferenciaNotificacionRepository;
import com.alertasegura.alertasegura.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PreferenciaNotificacionService {

    @Autowired
    private PreferenciaNotificacionRepository preferenciaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public PreferenciaNotificacionResponse obtenerMisPreferencias(String correoUsuario) {
        Usuario usuario = usuarioRepository.findByCorreo(correoUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
                
        PreferenciaNotificacion preferencia = preferenciaRepository.findByUsuarioIdUsuario(usuario.getIdUsuario())
                .orElseGet(() -> crearPreferenciaPorDefecto(usuario));
                
        return mapToResponse(preferencia);
    }

    public PreferenciaNotificacionResponse actualizarMisPreferencias(PreferenciaNotificacionRequest request, String correoUsuario) {
        Usuario usuario = usuarioRepository.findByCorreo(correoUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
                
        PreferenciaNotificacion preferencia = preferenciaRepository.findByUsuarioIdUsuario(usuario.getIdUsuario())
                .orElseGet(() -> crearPreferenciaPorDefecto(usuario));
                
        preferencia.setRecibirAlertas(request.getRecibirAlertas());
        preferencia.setRecibirReportes(request.getRecibirReportes());
        preferencia.setRecibirPrevencion(request.getRecibirPrevencion());
        preferencia.setRadioKm(request.getRadioKm());
        
        preferencia = preferenciaRepository.save(preferencia);
        return mapToResponse(preferencia);
    }

    private PreferenciaNotificacion crearPreferenciaPorDefecto(Usuario usuario) {
        PreferenciaNotificacion pref = PreferenciaNotificacion.builder()
                .usuario(usuario)
                .recibirAlertas(true)
                .recibirReportes(true)
                .recibirPrevencion(true)
                .radioKm(new BigDecimal("10.00"))
                .build();
        return preferenciaRepository.save(pref);
    }

    private PreferenciaNotificacionResponse mapToResponse(PreferenciaNotificacion preferencia) {
        return PreferenciaNotificacionResponse.builder()
                .recibirAlertas(preferencia.getRecibirAlertas())
                .recibirReportes(preferencia.getRecibirReportes())
                .recibirPrevencion(preferencia.getRecibirPrevencion())
                .radioKm(preferencia.getRadioKm())
                .build();
    }
}
