package service.electronic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import service.electronic.entity.ServiceOrderPart;

import java.util.List;

public interface ServiceOrderPartRepository extends JpaRepository<ServiceOrderPart, String> {
    List<ServiceOrderPart> findByServiceOrderId(String serviceOrderId);
}