package com.alertasegura.alertasegura.controller;

import com.alertasegura.alertasegura.dto.AlertaResponse;
import com.alertasegura.alertasegura.dto.ApiResponse;
import com.alertasegura.alertasegura.service.AlertaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
public class AlertaController {

    @Autowired
    private AlertaService alertaService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AlertaResponse>>> obtenerActivas() {
        return ResponseEntity.ok(ApiResponse.success(alertaService.obtenerTodasActivas()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AlertaResponse>> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(alertaService.obtenerPorId(id)));
    }
}
