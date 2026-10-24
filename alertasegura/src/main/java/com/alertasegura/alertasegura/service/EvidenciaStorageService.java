package com.alertasegura.alertasegura.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@Service
public class EvidenciaStorageService {

    private static final long MAX_FILE_SIZE_BYTES = 5L * 1024 * 1024;
    private static final Map<String, String> ALLOWED_CONTENT_TYPES = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp");

    private final Path rootDirectory;

    public EvidenciaStorageService(@Value("${app.uploads.dir:uploads}") String uploadsDirectory) {
        this.rootDirectory = Paths.get(uploadsDirectory).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.rootDirectory);
        } catch (IOException ex) {
            throw new IllegalStateException("No se pudo crear el directorio de evidencias", ex);
        }
    }

    public String guardar(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("El archivo de evidencia está vacío");
        }
        if (archivo.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("La imagen no puede superar los 5 MB");
        }

        String extension = ALLOWED_CONTENT_TYPES.get(archivo.getContentType());
        if (extension == null) {
            throw new IllegalArgumentException("Solo se permiten imágenes JPEG, PNG o WebP");
        }

        String nombreArchivo = UUID.randomUUID() + extension;
        Path destino = rootDirectory.resolve(nombreArchivo).normalize();
        if (!destino.startsWith(rootDirectory)) {
            throw new IllegalArgumentException("Nombre de archivo inválido");
        }

        try (InputStream inputStream = archivo.getInputStream()) {
            Files.copy(inputStream, destino, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new IllegalStateException("No se pudo guardar la evidencia", ex);
        }

        return "/uploads/" + nombreArchivo;
    }

    public void eliminar(String evidenciaUrl) {
        if (evidenciaUrl == null || !evidenciaUrl.startsWith("/uploads/")) {
            return;
        }

        Path archivo = rootDirectory.resolve(Paths.get(evidenciaUrl).getFileName().toString()).normalize();
        if (!archivo.startsWith(rootDirectory)) {
            return;
        }

        try {
            Files.deleteIfExists(archivo);
        } catch (IOException ignored) {
            // Un archivo huérfano no debe impedir la actualización del reporte.
        }
    }
}
