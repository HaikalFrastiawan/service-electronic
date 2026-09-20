package service.electronic.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "spare_parts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SparePart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tambahkan baris ini
    private Long id;

    @Column(name = "part_code")
    private String partCode;

    @Column(name = "part_name")
    private String partName;

    private String category;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @Column(name = "purchase_price")
    private BigDecimal purchasePrice;

    @Column(name = "selling_price")
    private BigDecimal sellingPrice;

    @Column(name = "min_stock_warning")
    private Integer minStockWarning;
}