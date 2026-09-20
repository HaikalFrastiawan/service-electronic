package service.electronic.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import service.electronic.entity.ServiceOrder;
import service.electronic.entity.ServiceStatus;

import java.math.BigDecimal;
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

    long countByStatus(ServiceStatus status);

    @Query("SELECT COALESCE(SUM(s.totalCost), 0) FROM ServiceOrder s WHERE s.status = 'COMPLETED'")
    BigDecimal calculateTotalRevenue();
}