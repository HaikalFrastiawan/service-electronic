package service.electronic.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceOrderPartResponse {

    private String id;
    private Long sparePartId;
    private String partCode;
    private String partName;
    private Integer quantity;
    private BigDecimal sellingPrice;
    private BigDecimal subtotal;
}