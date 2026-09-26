package com.alertasegura.alertasegura.repository;

import com.alertasegura.alertasegura.entity.EstadoReporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EstadoReporteRepository extends JpaRepository<EstadoReporte, Long> {
    Optional<EstadoReporte> findByNombre(String nombre);
}
