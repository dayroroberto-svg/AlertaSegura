package com.alertasegura.alertasegura.controller;

import com.alertasegura.alertasegura.dto.ApiResponse;
import com.alertasegura.alertasegura.dto.CrearReporteRequest;
import com.alertasegura.alertasegura.dto.ReporteResponse;
import com.alertasegura.alertasegura.service.ReporteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping(value = "/{id}/evidencia", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ReporteResponse>> adjuntarEvidencia(
            @PathVariable Long id,
            @RequestPart("archivo") MultipartFile archivo,
            Authentication authentication) {

        ReporteResponse response = reporteService.adjuntarEvidencia(id, authentication.getName(), archivo);
        return ResponseEntity.ok(ApiResponse.success("Evidencia adjuntada", response));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ApiResponse<List<ReporteResponse>>> obtenerTodos() {
        return ResponseEntity.ok(ApiResponse.success(reporteService.obtenerTodos()));
    }

    @GetMapping("/mis-reportes")
    public ResponseEntity<ApiResponse<List<ReporteResponse>>> obtenerMisReportes(Authentication authentication) {
        String correoUsuario = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success(reporteService.obtenerPorUsuario(correoUsuario)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ApiResponse<ReporteResponse>> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(reporteService.obtenerPorId(id)));
    }
}
