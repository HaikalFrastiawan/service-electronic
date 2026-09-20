package service.electronic.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import service.electronic.dto.*;
import service.electronic.service.EmailService;
import service.electronic.service.UserService;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<WebResponse<UserResponse>> register(@Valid @RequestBody RegisterUserRequest request){
        UserResponse userResponse = userService.register(request);

        WebResponse<UserResponse> response = WebResponse.<UserResponse>builder()
                .success(true)
                .message("Registrasi berhasil")
                .data(userResponse)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<WebResponse<AuthResponse>> login(@Valid @RequestBody LoginUserRequest request){
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(WebResponse.<AuthResponse>builder()
                .data(response)
                .build());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        // 1. (Opsional tapi wajib nantinya) Cek apakah email terdaftar di database
        // User user = userRepository.findByEmail(email);
        // if (user == null) { return ResponseEntity.badRequest().body("Email tidak ditemukan"); }

        // 2. Generate token unik acak (Anda idealnya menyimpan token ini ke database beserta waktu kadaluarsanya)
        String resetToken = UUID.randomUUID().toString();

        // 3. Kirim Email
        try {
            emailService.sendResetPasswordEmail(email, resetToken);

            Map<String, String> response = new  HashMap<>();
            response.put("message", "Tautan reset password berhasil dikirim ke email Anda.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Gagal mengirim email: " + e.getMessage());
        }
    }
}
