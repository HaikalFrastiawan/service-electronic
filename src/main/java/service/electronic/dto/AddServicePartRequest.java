package service.electronic.dto;

import lombok.Data;

@Data
public class AddServicePartRequest {
    private Long sparePartId;
    private Integer quantity;
}