package service.electronic.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.core.userdetails.UserDetailsService;
import service.electronic.security.JwtUtil;
import service.electronic.dto.RegisterUserRequest;
import service.electronic.dto.UserResponse;
import service.electronic.entity.Role;
import service.electronic.service.UserService;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserDetailsService userDetailsService;

    @Test
    @DisplayName("POST /api/v1/auth/register - HTTP 201 Created")
    void register_Success() throws Exception {
        RegisterUserRequest request = RegisterUserRequest.builder()
                .fullName("Budi Santoso")
                .email("budi.santoso@example.com")
                .password("Password123!")
                .build();

        UserResponse userResponse = UserResponse.builder()
                .id("usr_123")
                .fullName("Budi Santoso")
                .email("budi.santoso@example.com")
                .role(Role.ROLE_CUSTOMER)
                .createdAt(LocalDateTime.now())
                .build();

        when(userService.register(any(RegisterUserRequest.class))).thenReturn(userResponse);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("budi.santoso@example.com"));
    }
}