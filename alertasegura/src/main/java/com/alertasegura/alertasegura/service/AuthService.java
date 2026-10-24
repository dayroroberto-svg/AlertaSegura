package com.alertasegura.alertasegura.service;

import com.alertasegura.alertasegura.dto.LoginRequest;
import com.alertasegura.alertasegura.dto.LoginResponse;
import com.alertasegura.alertasegura.dto.RegistroUsuarioRequest;
import com.alertasegura.alertasegura.entity.Rol;
import com.alertasegura.alertasegura.entity.Usuario;
import com.alertasegura.alertasegura.exception.ConflictException;
import com.alertasegura.alertasegura.exception.ResourceNotFoundException;
import com.alertasegura.alertasegura.repository.RolRepository;
import com.alertasegura.alertasegura.repository.UsuarioRepository;
import com.alertasegura.alertasegura.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Locale;

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

    @Transactional
    public LoginResponse login(LoginRequest request) {
        String correo = normalizarCorreo(request.getCorreo());

        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(correo)
                .orElseThrow(() -> new ResourceNotFoundException("El correo no está registrado. Regístrate para crear tu cuenta."));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(correo, request.getContrasena())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

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

    @Transactional
    public void registrarUsuario(RegistroUsuarioRequest request) {
        String correo = normalizarCorreo(request.getCorreo());

        if (usuarioRepository.existsByCorreoIgnoreCase(correo)) {
            throw new ConflictException("El correo ya está registrado");
        }

        Rol rolCiudadano = rolRepository.findByNombre("CIUDADANO")
                .orElseThrow(() -> new IllegalStateException("Rol CIUDADANO no encontrado"));

        Usuario nuevoUsuario = Usuario.builder()
                .nombres(request.getNombres().trim())
                .apellidos(request.getApellidos().trim())
                .correo(correo)
                .contrasena(passwordEncoder.encode(request.getContrasena()))
                .telefono(request.getTelefono())
                .rol(rolCiudadano)
                .estado(Usuario.EstadoUsuario.ACTIVO)
                .build();

        try {
            usuarioRepository.saveAndFlush(nuevoUsuario);
        } catch (DataIntegrityViolationException ex) {
            throw new ConflictException("El correo ya está registrado");
        }
    }

    private String normalizarCorreo(String correo) {
        return correo == null ? null : correo.trim().toLowerCase(Locale.ROOT);
    }
}
