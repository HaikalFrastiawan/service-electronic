package service.electronic.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddServicePartRequest {

    @NotNull(message = "ID sparepart wajib diisi")
    private Long sparePartId;

    @NotNull(message = "Jumlah kuantitas wajib diisi")
    @Min(value = 1, message = "Kuantitas minimal 1 unit")
    private Integer quantity;
}