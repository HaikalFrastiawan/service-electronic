package service.electronic.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import service.electronic.entity.DeviceCategory;
import service.electronic.entity.ServiceStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceOrderResponse {

    private String id;
    private String orderNumber;
    private ServiceStatus status;
    private BigDecimal estimatedCost;
    private BigDecimal totalCost;
    private String completionNotes;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    // Detail Perangkat
    private String deviceId;
    private DeviceCategory category;
    private String brand;
    private String modelName;
    private String serialNumber;
    private String issueDescription;

    // Detail Pelanggan
    private String customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;

    // Detail Penanggung Jawab / Admin (Pengganti Technician)
    private String handledById;
    private String handledByName;
    private String handledByEmail;

    // Rincian Sparepart Terpasang
    private List<ServiceOrderPartResponse> parts;
}