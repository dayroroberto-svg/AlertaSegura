package com.alertasegura.alertasegura.repository;

import com.alertasegura.alertasegura.entity.Ubicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UbicacionRepository extends JpaRepository<Ubicacion, Long> {
    List<Ubicacion> findByDistrito(String distrito);
    List<Ubicacion> findByDepartamento(String departamento);
}
