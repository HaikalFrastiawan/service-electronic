package service.electronic.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import service.electronic.entity.ServiceOrderPart;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceOrderPartRepository extends JpaRepository<ServiceOrderPart, String> {

    @EntityGraph(attributePaths = {"sparePart"})
    List<ServiceOrderPart> findByServiceOrderId(String serviceOrderId);

    Optional<ServiceOrderPart> findByServiceOrderIdAndSparePartId(String serviceOrderId, Long sparePartId);

    void deleteByServiceOrderId(String serviceOrderId);
}