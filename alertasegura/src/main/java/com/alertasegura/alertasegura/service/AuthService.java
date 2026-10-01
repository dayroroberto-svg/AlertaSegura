package com.alertasegura.alertasegura.service;

import com.alertasegura.alertasegura.dto.LoginRequest;
import com.alertasegura.alertasegura.dto.LoginResponse;
import com.alertasegura.alertasegura.dto.RegistroUsuarioRequest;
import com.alertasegura.alertasegura.entity.Rol;
import com.alertasegura.alertasegura.entity.Usuario;
import com.alertasegura.alertasegura.repository.RolRepository;
import com.alertasegura.alertasegura.repository.UsuarioRepository;
import com.alertasegura.alertasegura.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getContrasena())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        usuario.setUltimaConexion(LocalDateTime.now());
        usuarioRepository.save(usuario);

        return LoginResponse.builder()
                .token(jwt)
                .tipo("Bearer")
                .idUsuario(usuario.getIdUsuario())
                .nombres(usuario.getNombres())
                .apellidos(usuario.getApellidos())
                .correo(usuario.getCorreo())
                .rol(usuario.getRol().getNombre())
                .build();
    }

    public void registrarUsuario(RegistroUsuarioRequest request) {
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }

        Rol rolCiudadano = rolRepository.findByNombre("CIUDADANO")
                .orElseThrow(() -> new RuntimeException("Rol CIUDADANO no encontrado"));

        Usuario nuevoUsuario = Usuario.builder()
                .nombres(request.getNombres())
                .apellidos(request.getApellidos())
                .correo(request.getCorreo())
                .contrasena(passwordEncoder.encode(request.getContrasena()))
                .telefono(request.getTelefono())
                .rol(rolCiudadano)
                .estado(Usuario.EstadoUsuario.ACTIVO)
                .build();

        usuarioRepository.save(nuevoUsuario);
    }
}
