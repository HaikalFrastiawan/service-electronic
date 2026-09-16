package service.electronic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import service.electronic.entity.ServiceOrder;
import service.electronic.entity.ServiceStatus;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, String> {
    Optional<ServiceOrder> findByOrderNumber(String orderNumber);
    List<ServiceOrder> findByCustomerId(String customerId);
    List<ServiceOrder> findByTechnicianId(String technicianId);
    List<ServiceOrder> findByStatus(ServiceStatus status);

}
