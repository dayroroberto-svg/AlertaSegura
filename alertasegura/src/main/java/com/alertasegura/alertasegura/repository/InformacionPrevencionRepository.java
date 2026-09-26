package com.alertasegura.alertasegura.repository;

import com.alertasegura.alertasegura.entity.InformacionPrevencion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InformacionPrevencionRepository extends JpaRepository<InformacionPrevencion, Long> {
    List<InformacionPrevencion> findByCategoriaPrevencionIdCategoriaPrevencion(Long idCategoria);
}
