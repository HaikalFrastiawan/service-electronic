package service.electronic.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import service.electronic.dto.RegisterUserRequest;
import service.electronic.dto.UserResponse;
import service.electronic.entity.Role;
import service.electronic.entity.User;
import service.electronic.repository.UserRepository;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private RegisterUserRequest request;

    @BeforeEach
    void setUp() {
        request = RegisterUserRequest.builder()
                .fullName("Budi Santoso")
                .email("budi.santoso@example.com")
                .password("Password123!")
                .phoneNumber("081234567890")
                .address("Jakarta")
                .build();
    }

    @Test
    @DisplayName("Register - Berhasil mendaftarkan user baru")
    void register_Success() {
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("$2a$10$encryptedPassword");

        User savedUser = User.builder()
                .id("usr_123")
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password("$2a$10$encryptedPassword")
                .role(Role.ROLE_CUSTOMER)
                .createdAt(LocalDateTime.now())
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserResponse response = userService.register(request);

        assertNotNull(response);
        assertEquals("usr_123", response.getId());
        assertEquals("budi.santoso@example.com", response.getEmail());
    }

    @Test
    @DisplayName("Register - Gagal karena email sudah terdaftar")
    void register_EmailAlreadyExists_ShouldThrowException() {
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        assertThrows(ResponseStatusException.class, () -> userService.register(request));
        verify(userRepository, never()).save(any());
    }
}