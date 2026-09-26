package com.alertasegura.alertasegura.repository;

import com.alertasegura.alertasegura.entity.Verificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VerificacionRepository extends JpaRepository<Verificacion, Long> {
    List<Verificacion> findByReporteIdReporte(Long idReporte);
    List<Verificacion> findByAdministradorIdUsuario(Long idAdministrador);
}
