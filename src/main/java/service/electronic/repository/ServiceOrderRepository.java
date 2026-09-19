package service.electronic.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import service.electronic.entity.ServiceOrder;
import service.electronic.entity.ServiceStatus;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, String> {

    @Override
    @EntityGraph(attributePaths = {"device", "customer", "technician"})
    List<ServiceOrder> findAll();

    @EntityGraph(attributePaths = {"device", "customer", "technician"})
    Optional<ServiceOrder> findByOrderNumber(String orderNumber);

    @EntityGraph(attributePaths = {"device", "customer", "technician"})
    List<ServiceOrder> findByCustomerId(String customerId);

    @EntityGraph(attributePaths = {"device", "customer", "technician"})
    List<ServiceOrder> findByTechnicianId(String technicianId);

    @EntityGraph(attributePaths = {"device", "customer", "technician"})
    List<ServiceOrder> findByStatus(ServiceStatus status);
}