package com.alertasegura.alertasegura.repository;

import com.alertasegura.alertasegura.entity.Auditoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditoriaRepository extends JpaRepository<Auditoria, Long> {
    List<Auditoria> findByUsuarioIdUsuarioOrderByFechaAccionDesc(Long idUsuario);
    List<Auditoria> findByTablaAfectadaOrderByFechaAccionDesc(String tablaAfectada);
    List<Auditoria> findAllByOrderByFechaAccionDesc();
}
