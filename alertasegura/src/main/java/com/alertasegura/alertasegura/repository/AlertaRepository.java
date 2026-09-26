package com.alertasegura.alertasegura.repository;

import com.alertasegura.alertasegura.entity.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> {
    Optional<Alerta> findByCodigoAlerta(String codigoAlerta);
    List<Alerta> findByEstadoAlertaNombre(String estadoNombre);
    List<Alerta> findByCategoriaNombre(String categoriaNombre);
    List<Alerta> findByNivelRiesgoNombre(String nivelNombre);
    List<Alerta> findByUbicacionDistrito(String distrito);
    List<Alerta> findAllByOrderByFechaPublicacionDesc();
    List<Alerta> findByEstadoAlertaNombreNotOrderByFechaPublicacionDesc(String estadoExcluido);
}
