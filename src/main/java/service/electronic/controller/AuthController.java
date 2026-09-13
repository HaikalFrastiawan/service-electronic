package service.electronic.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import service.electronic.dto.RegisterUserRequest;
import service.electronic.dto.UserResponse;
import service.electronic.dto.WebResponse;
import service.electronic.service.UserService;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

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
}
