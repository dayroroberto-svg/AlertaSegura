package com.alertasegura.alertasegura.controller;

import com.alertasegura.alertasegura.dto.ApiResponse;
import com.alertasegura.alertasegura.dto.LoginRequest;
import com.alertasegura.alertasegura.dto.LoginResponse;
import com.alertasegura.alertasegura.dto.RegistroUsuarioRequest;
import com.alertasegura.alertasegura.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Login exitoso", response));
    }

    @PostMapping("/registro")
    public ResponseEntity<ApiResponse<Void>> registrar(@Valid @RequestBody RegistroUsuarioRequest registroRequest) {
        authService.registrarUsuario(registroRequest);
        return ResponseEntity.ok(ApiResponse.success("Usuario registrado exitosamente", null));
    }
}
