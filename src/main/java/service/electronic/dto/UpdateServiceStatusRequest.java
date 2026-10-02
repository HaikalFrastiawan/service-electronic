package service.electronic.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import service.electronic.entity.ServiceStatus;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateServiceStatusRequest {

    @NotNull(message = "Status layanan wajib diisi")
    private ServiceStatus status;

    @DecimalMin(value = "0.0", message = "Estimasi biaya tidak boleh negatif")
    private BigDecimal estimatedCost;

    @DecimalMin(value = "0.0", message = "Total biaya tidak boleh negatif")
    private BigDecimal totalCost;

    private String completionNotes;

    // Menyesuaikan tipe ID User yang berupa UUID (String)
    private String handledById;
}