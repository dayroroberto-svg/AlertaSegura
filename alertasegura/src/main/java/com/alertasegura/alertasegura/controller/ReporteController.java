package com.alertasegura.alertasegura.controller;

import com.alertasegura.alertasegura.dto.ApiResponse;
import com.alertasegura.alertasegura.dto.CrearReporteRequest;
import com.alertasegura.alertasegura.dto.ReporteResponse;
import com.alertasegura.alertasegura.service.ReporteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReporteResponse>> crearReporte(
            @Valid @RequestBody CrearReporteRequest request,
            Authentication authentication) {
        
        String correoUsuario = authentication.getName();
        ReporteResponse response = reporteService.crearReporte(request, correoUsuario);
        return ResponseEntity.ok(ApiResponse.success("Reporte creado exitosamente", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReporteResponse>>> obtenerTodos() {
        return ResponseEntity.ok(ApiResponse.success(reporteService.obtenerTodos()));
    }

    @GetMapping("/mis-reportes")
    public ResponseEntity<ApiResponse<List<ReporteResponse>>> obtenerMisReportes(Authentication authentication) {
        String correoUsuario = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success(reporteService.obtenerPorUsuario(correoUsuario)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReporteResponse>> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(reporteService.obtenerPorId(id)));
    }
}
