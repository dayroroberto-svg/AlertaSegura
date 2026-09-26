package com.alertasegura.alertasegura.repository;

import com.alertasegura.alertasegura.entity.HistorialAlerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistorialAlertaRepository extends JpaRepository<HistorialAlerta, Long> {
    List<HistorialAlerta> findByAlertaIdAlertaOrderByFechaCambioDesc(Long idAlerta);
}
