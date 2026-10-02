package service.electronic.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(
        name = "spare_parts",
        indexes = {
                @Index(name = "idx_part_code", columnList = "part_code"),
                @Index(name = "idx_part_category", columnList = "category")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class SparePart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "part_code", nullable = false, unique = true, length = 50)
    private String partCode;

    @Column(name = "part_name", nullable = false, length = 100)
    private String partName;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @Column(name = "purchase_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal purchasePrice;

    @Column(name = "selling_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal sellingPrice;

    @Column(name = "min_stock_warning", nullable = false)
    private Integer minStockWarning;

    @Version
    private Long version; // Optimistic Lock untuk pengamanan pemotongan stok beruntun
}