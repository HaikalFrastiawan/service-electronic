package service.electronic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import service.electronic.entity.SparePart;

import java.util.List;

public interface SparePartRepository extends JpaRepository<SparePart, String> {

    @Query("SELECT s FROM SparePart s WHERE s.stockQuantity <= s.minStockWarning")
    List<SparePart> findLowStockParts();
}