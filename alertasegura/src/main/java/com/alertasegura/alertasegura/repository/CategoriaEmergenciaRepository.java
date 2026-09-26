package com.alertasegura.alertasegura.repository;

import com.alertasegura.alertasegura.entity.CategoriaEmergencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoriaEmergenciaRepository extends JpaRepository<CategoriaEmergencia, Long> {
    List<CategoriaEmergencia> findByEstado(CategoriaEmergencia.EstadoCategoria estado);
}
