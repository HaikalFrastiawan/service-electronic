package service.electronic.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class SparePartResponse {
    private String id;
    private String partCode;
    private String partName;
    private String category;
    private Integer stockQuantity;
    private BigDecimal purchasePrice;
    private BigDecimal sellingPrice;
    private Integer minStockWarning;
    private Boolean isLowStock;
}