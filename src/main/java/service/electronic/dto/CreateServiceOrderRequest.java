package service.electronic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import service.electronic.entity.DeviceCategory;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateServiceOrderRequest {
    @NotNull(message = "Kategori perangkat wajib dipilih")
    private DeviceCategory category;

    @NotBlank(message = "Merek perangkat wajib diisi")
    private String brand;

    @NotBlank(message = "Tipe/model perangkat wajib diisi")
    private String modelName;

    private String serialNumber;

    @NotBlank(message = "Deskripsi keluhan wajib diisi")
    private String issueDescription;
}
