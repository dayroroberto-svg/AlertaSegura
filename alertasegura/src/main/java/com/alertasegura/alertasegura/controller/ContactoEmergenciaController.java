package com.alertasegura.alertasegura.controller;

import com.alertasegura.alertasegura.dto.ApiResponse;
import com.alertasegura.alertasegura.dto.ContactoEmergenciaResponse;
import com.alertasegura.alertasegura.service.ContactoEmergenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/contactos-emergencia")
public class ContactoEmergenciaController {

    @Autowired
    private ContactoEmergenciaService contactoService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ContactoEmergenciaResponse>>> obtenerActivos() {
        return ResponseEntity.ok(ApiResponse.success(contactoService.obtenerActivos()));
    }
}
