package service.electronic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import service.electronic.entity.SparePart;

import java.util.List;

@Repository
public interface SparePartRepository extends JpaRepository<SparePart, Long> {

    long countByCategoryIgnoreCase(String category);
    @Query("SELECT s FROM SparePart s WHERE s.stockQuantity <= s.minStockWarning")
    List<SparePart> findLowStockParts();
}