package com.alertasegura.alertasegura.service;

import com.alertasegura.alertasegura.dto.NotificacionResponse;
import com.alertasegura.alertasegura.entity.Notificacion;
import com.alertasegura.alertasegura.entity.Usuario;
import com.alertasegura.alertasegura.exception.ResourceNotFoundException;
import com.alertasegura.alertasegura.repository.NotificacionRepository;
import com.alertasegura.alertasegura.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificacionService {

    @Autowired
    private NotificacionRepository notificacionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<NotificacionResponse> obtenerMisNotificaciones(String correoUsuario) {
        Usuario usuario = usuarioRepository.findByCorreo(correoUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
                
        return notificacionRepository.findByUsuarioIdUsuarioOrderByFechaEnvioDesc(usuario.getIdUsuario())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public void marcarComoLeida(Long idNotificacion, String correoUsuario) {
        Notificacion notificacion = notificacionRepository.findById(idNotificacion)
                .orElseThrow(() -> new ResourceNotFoundException("Notificación no encontrada"));
        
        if (!notificacion.getUsuario().getCorreo().equals(correoUsuario)) {
            throw new RuntimeException("No tiene permisos para modificar esta notificación");
        }
        
        notificacion.setLeida(true);
        notificacionRepository.save(notificacion);
    }

    private NotificacionResponse mapToResponse(Notificacion notificacion) {
        return NotificacionResponse.builder()
                .idNotificacion(notificacion.getIdNotificacion())
                .titulo(notificacion.getTitulo())
                .mensaje(notificacion.getMensaje())
                .tipo(notificacion.getTipo().name())
                .leida(notificacion.getLeida())
                .fechaEnvio(notificacion.getFechaEnvio())
                .idAlerta(notificacion.getAlerta() != null ? notificacion.getAlerta().getIdAlerta() : null)
                .build();
    }
}
