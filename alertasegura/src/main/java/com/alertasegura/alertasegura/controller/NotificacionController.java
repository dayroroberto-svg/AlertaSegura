package com.alertasegura.alertasegura.controller;

import com.alertasegura.alertasegura.dto.ApiResponse;
import com.alertasegura.alertasegura.dto.NotificacionResponse;
import com.alertasegura.alertasegura.service.NotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificacionResponse>>> obtenerMisNotificaciones(Authentication authentication) {
        String correoUsuario = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success(notificacionService.obtenerMisNotificaciones(correoUsuario)));
    }

    @PutMapping("/{id}/leer")
    public ResponseEntity<ApiResponse<Void>> marcarComoLeida(@PathVariable Long id, Authentication authentication) {
        String correoUsuario = authentication.getName();
        notificacionService.marcarComoLeida(id, correoUsuario);
        return ResponseEntity.ok(ApiResponse.success("Notificación marcada como leída", null));
    }
}
