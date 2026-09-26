package com.alertasegura.alertasegura.repository;

import com.alertasegura.alertasegura.entity.NivelRiesgo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface NivelRiesgoRepository extends JpaRepository<NivelRiesgo, Long> {
    Optional<NivelRiesgo> findByNombre(String nombre);
}
