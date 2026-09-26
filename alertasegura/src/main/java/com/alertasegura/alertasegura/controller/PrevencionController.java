package com.alertasegura.alertasegura.controller;

import com.alertasegura.alertasegura.dto.ApiResponse;
import com.alertasegura.alertasegura.dto.InformacionPrevencionResponse;
import com.alertasegura.alertasegura.service.PrevencionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/informacion-prevencion")
public class PrevencionController {

    @Autowired
    private PrevencionService prevencionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<InformacionPrevencionResponse>>> obtenerTodas() {
        return ResponseEntity.ok(ApiResponse.success(prevencionService.obtenerTodas()));
    }
}
