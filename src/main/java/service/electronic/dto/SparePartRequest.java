package service.electronic.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SparePartRequest {

    @NotBlank(message = "Kode sparepart wajib diisi")
    @Size(max = 50, message = "Kode sparepart maksimal 50 karakter")
    private String partCode;

    @NotBlank(message = "Nama sparepart wajib diisi")
    @Size(max = 100, message = "Nama sparepart maksimal 100 karakter")
    private String partName;

    @NotBlank(message = "Kategori sparepart wajib diisi")
    @Size(max = 50, message = "Kategori maksimal 50 karakter")
    private String category;

    @NotNull(message = "Jumlah stok wajib diisi")
    @Min(value = 0, message = "Stok tidak boleh negatif")
    private Integer stockQuantity;

    @NotNull(message = "Harga beli wajib diisi")
    @DecimalMin(value = "0.0", message = "Harga beli tidak boleh negatif")
    private BigDecimal purchasePrice;

    @NotNull(message = "Harga jual wajib diisi")
    @DecimalMin(value = "0.0", message = "Harga jual tidak boleh negatif")
    private BigDecimal sellingPrice;

    @NotNull(message = "Batas minimal stok peringatan wajib diisi")
    @Min(value = 0, message = "Batas stok peringatan tidak boleh negatif")
    private Integer minStockWarning;
}