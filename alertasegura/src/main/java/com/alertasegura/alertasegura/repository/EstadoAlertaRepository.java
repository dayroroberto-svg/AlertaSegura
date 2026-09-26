package com.alertasegura.alertasegura.repository;

import com.alertasegura.alertasegura.entity.EstadoAlerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EstadoAlertaRepository extends JpaRepository<EstadoAlerta, Long> {
    Optional<EstadoAlerta> findByNombre(String nombre);
}
