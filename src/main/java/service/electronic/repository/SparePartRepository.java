package service.electronic.repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import service.electronic.entity.SparePart;

import java.util.List;
import java.util.Optional;

@Repository
public interface SparePartRepository extends JpaRepository<SparePart, Long> {

    boolean existsByPartCode(String partCode);

    long countByCategoryIgnoreCase(String category);

    //race conditon solve
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM SparePart s WHERE s.id = :id")
    Optional<SparePart> findByIdWithLock(@Param("id") Long id);

    @Query("SELECT s FROM SparePart s WHERE s.stockQuantity <= s.minStockWarning")
    List<SparePart> findLowStockParts();

    @Query("SELECT COUNT(s) FROM SparePart s WHERE s.stockQuantity <= s.minStockWarning")
    long countLowStockParts();
}