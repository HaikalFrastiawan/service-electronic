package service.electronic.dto;

import lombok.Data;

@Data
public class AddServicePartRequest {
    private String sparePartId;
    private Integer quantity;
}