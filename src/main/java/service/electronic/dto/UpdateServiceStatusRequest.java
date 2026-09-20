package service.electronic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import service.electronic.entity.ServiceStatus;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateServiceStatusRequest {
    private ServiceStatus status;
    private BigDecimal estimatedCost;
    private BigDecimal totalCost;
    private String completionNotes;
    private Long technicianId;

    // Tambahkan field ini agar input sparepart dari modal tidak ditolak Spring Boot
    private Long sparePartId;
    private Integer quantity;
}