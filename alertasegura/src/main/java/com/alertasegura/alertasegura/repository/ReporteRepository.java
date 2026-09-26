package com.alertasegura.alertasegura.repository;

import com.alertasegura.alertasegura.entity.Reporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReporteRepository extends JpaRepository<Reporte, Long> {
    Optional<Reporte> findByCodigoReporte(String codigoReporte);
    List<Reporte> findByUsuarioIdUsuario(Long idUsuario);
    List<Reporte> findByEstadoReporteNombre(String estadoNombre);
    List<Reporte> findByCategoriaNombre(String categoriaNombre);
    List<Reporte> findByUsuarioIdUsuarioOrderByFechaReporteDesc(Long idUsuario);
    List<Reporte> findAllByOrderByFechaReporteDesc();
}
