package com.alertasegura.alertasegura.repository;

import com.alertasegura.alertasegura.entity.CategoriaPrevencion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoriaPrevencionRepository extends JpaRepository<CategoriaPrevencion, Long> {
    List<CategoriaPrevencion> findByEstado(CategoriaPrevencion.EstadoCategoriaPrevencion estado);
}
