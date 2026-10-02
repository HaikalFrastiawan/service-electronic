package service.electronic.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import service.electronic.entity.DeviceCategory;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateServiceOrderRequest {

    @NotNull(message = "Kategori perangkat wajib dipilih")
    private DeviceCategory category;

    @NotBlank(message = "Merek perangkat wajib diisi")
    @Size(max = 100, message = "Merek perangkat maksimal 100 karakter")
    private String brand;

    @NotBlank(message = "Tipe/model perangkat wajib diisi")
    @Size(max = 100, message = "Tipe/model perangkat maksimal 100 karakter")
    private String modelName;

    @Size(max = 100, message = "Nomor seri maksimal 100 karakter")
    private String serialNumber;

    @NotBlank(message = "Deskripsi keluhan wajib diisi")
    private String issueDescription;

    @Email(message = "Format email pelanggan tidak valid")
    private String customerEmail;

    @Size(max = 100, message = "Nama pelanggan maksimal 100 karakter")
    private String customerName;

    @Size(max = 20, message = "Nomor telepon pelanggan maksimal 20 karakter")
    private String customerPhone;

    private String customerAddress;
}