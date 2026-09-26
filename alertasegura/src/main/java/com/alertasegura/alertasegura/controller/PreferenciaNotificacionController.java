package com.alertasegura.alertasegura.controller;

import com.alertasegura.alertasegura.dto.ApiResponse;
import com.alertasegura.alertasegura.dto.PreferenciaNotificacionRequest;
import com.alertasegura.alertasegura.dto.PreferenciaNotificacionResponse;
import com.alertasegura.alertasegura.service.PreferenciaNotificacionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preferencias-notificacion")
public class PreferenciaNotificacionController {

    @Autowired
    private PreferenciaNotificacionService preferenciaService;

    @GetMapping
    public ResponseEntity<ApiResponse<PreferenciaNotificacionResponse>> obtenerMisPreferencias(Authentication authentication) {
        String correoUsuario = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success(preferenciaService.obtenerMisPreferencias(correoUsuario)));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<PreferenciaNotificacionResponse>> actualizarPreferencias(
            @Valid @RequestBody PreferenciaNotificacionRequest request,
            Authentication authentication) {
        
        String correoUsuario = authentication.getName();
        PreferenciaNotificacionResponse response = preferenciaService.actualizarMisPreferencias(request, correoUsuario);
        return ResponseEntity.ok(ApiResponse.success("Preferencias actualizadas", response));
    }
}
