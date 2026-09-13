package service.electronic.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secretKey", "RahasiaSuperAmanElektronikServiceBackendKey2026!");
        ReflectionTestUtils.setField(jwtUtil, "expirationMs", 3600000L);
    }

    @Test
    @DisplayName("Token JWT - Berhasil generate dan validasi token")
    void jwtFlow_Success() {
        String token = jwtUtil.generateToken("budi@example.com", "ROLE_CUSTOMER");

        assertNotNull(token);
        assertTrue(jwtUtil.validateToken(token));
        assertEquals("budi@example.com", jwtUtil.getEmailFromToken(token));
    }
}
