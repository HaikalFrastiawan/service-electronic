package service.electronic.repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import service.electronic.entity.ServiceOrder;
import service.electronic.entity.ServiceStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, String> {

    @Override
    @EntityGraph(attributePaths = {"device", "customer", "handledBy"})
    List<ServiceOrder> findAll();

    @EntityGraph(attributePaths = {"device", "customer", "handledBy", "orderParts", "orderParts.sparePart"})
    Optional<ServiceOrder> findDetailById(String id);

    @EntityGraph(attributePaths = {"device", "customer", "handledBy", "orderParts", "orderParts.sparePart"})
    Optional<ServiceOrder> findByOrderNumber(String orderNumber);

    @EntityGraph(attributePaths = {"device", "customer", "handledBy"})
    List<ServiceOrder> findByCustomerId(String customerId);

    @EntityGraph(attributePaths = {"device", "customer", "handledBy"})
    List<ServiceOrder> findByHandledById(String handledById);

    @EntityGraph(attributePaths = {"device", "customer", "handledBy"})
    List<ServiceOrder> findByStatus(ServiceStatus status);

   //rece conditon solve
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM ServiceOrder s WHERE s.id = :id")
    Optional<ServiceOrder> findByIdWithLock(@Param("id") String id);

    long countByStatus(ServiceStatus status);

    long countByStatusIn(List<ServiceStatus> statuses);

    long countByStatusAndUpdatedAtBetween(ServiceStatus status, LocalDateTime start, LocalDateTime end);

    @Query("SELECT COALESCE(SUM(s.totalCost), 0) FROM ServiceOrder s WHERE s.status = 'COMPLETED'")
    BigDecimal calculateTotalRevenue();
}