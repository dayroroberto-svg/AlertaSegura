package com.alertasegura.alertasegura.repository;

import com.alertasegura.alertasegura.entity.ContactoEmergencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContactoEmergenciaRepository extends JpaRepository<ContactoEmergencia, Long> {
    List<ContactoEmergencia> findByEstado(ContactoEmergencia.EstadoContacto estado);
    List<ContactoEmergencia> findByTipoContactoIdTipoContacto(Long idTipoContacto);
    List<ContactoEmergencia> findByDistrito(String distrito);
}
