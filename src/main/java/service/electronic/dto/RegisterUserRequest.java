package service.electronic.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterUserRequest {

    @NotBlank(message = "Nama lengkap wajib diisi")
    @Size(max = 100, message = "Nama lengkap maksimal 100 karakter")
    private String fullName;

    @NotBlank(message = "Email wajib diisi")
    @Email(message = "Format email tidak valid")
    @Size(max = 100, message = "Email maksimal 100 karakter")
    private String email;

    @NotBlank(message = "Password wajib diisi")
    @Size(min = 6, max = 100, message = "Password harus 6 - 100 karakter")
    private String password;

    @Size(max = 20, message = "Nomor telepon maksimal 20 karakter")
    private String phoneNumber;

    private String address;
}