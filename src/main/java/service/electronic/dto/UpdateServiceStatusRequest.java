package service.electronic.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import service.electronic.entity.ServiceStatus;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateServiceStatusRequest {

    @NotNull(message = "Status perbaikan wajib diisi")
    private ServiceStatus status;

    private BigDecimal estimatedCost;

    private BigDecimal totalCost;

    private String completionNotes;

    private String technicianId;
}