package service.electronic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import service.electronic.entity.DeviceCategory;
import service.electronic.entity.ServiceStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ServiceOrderResponse {

    private String id;
    private String orderNumber;
    private ServiceStatus status;
    private BigDecimal estimatedCost;
    private BigDecimal totalCost;
    private String completionNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Detail Perangkat
    private String deviceId;
    private DeviceCategory category;
    private String brand;
    private String modelName;
    private String serialNumber;
    private String issueDescription;

    // Detail Pelanggan & Teknisi (Hanya informasi non-sensitif)
    private String customerEmail;
    private String technicianEmail;
}