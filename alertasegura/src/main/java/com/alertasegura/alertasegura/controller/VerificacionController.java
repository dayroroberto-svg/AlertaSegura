package com.alertasegura.alertasegura.controller;

import com.alertasegura.alertasegura.dto.ApiResponse;
import com.alertasegura.alertasegura.dto.VerificacionRequest;
import com.alertasegura.alertasegura.dto.VerificacionResponse;
import com.alertasegura.alertasegura.service.VerificacionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/verificaciones")
public class VerificacionController {

    @Autowired
    private VerificacionService verificacionService;

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ApiResponse<VerificacionResponse>> verificar(
            @Valid @RequestBody VerificacionRequest request,
            Authentication authentication) {
        
        String correoAdmin = authentication.getName();
        VerificacionResponse response = verificacionService.verificar(request, correoAdmin);
        return ResponseEntity.ok(ApiResponse.success("Verificación registrada", response));
    }

    @GetMapping("/reporte/{idReporte}")
    public ResponseEntity<ApiResponse<List<VerificacionResponse>>> obtenerPorReporte(@PathVariable Long idReporte) {
        return ResponseEntity.ok(ApiResponse.success(verificacionService.obtenerPorReporte(idReporte)));
    }
}
