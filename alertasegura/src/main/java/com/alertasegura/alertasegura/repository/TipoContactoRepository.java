package com.alertasegura.alertasegura.repository;

import com.alertasegura.alertasegura.entity.TipoContacto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoContactoRepository extends JpaRepository<TipoContacto, Long> {
}
