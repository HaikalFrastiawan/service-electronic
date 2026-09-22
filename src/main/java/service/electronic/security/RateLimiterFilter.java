package service.electronic.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class RateLimiterFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil; // Inject JwtService untuk membaca identitas user
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    // Aturan Bucket: Maksimal 10 request per 1 menit
    private Bucket createNewBucket() {
        // Syntax modern Bucket4j 8.x (tanpa method deprecated)
        Bandwidth limit = Bandwidth.builder()
                .capacity(10)
                .refillGreedy(10, Duration.ofMinutes(1))
                .build();

        return Bucket.builder().addLimit(limit).build();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. ABAIKAN HTTP OPTIONS (CORS Preflight) agar tidak memakan kuota token
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();

        // 2. Terapkan Rate Limiter khusus untuk endpoint API (/api/...)
        if (path.startsWith("/api/")) {
            String bucketKey = getBucketKey(request);

            // Ambil atau buatkan bucket berdasarkan Key (User ID / IP)
            Bucket bucket = cache.computeIfAbsent(bucketKey, k -> createNewBucket());

            // Coba konsumsi 1 token
            if (!bucket.tryConsume(1)) {
                sendRateLimitResponse(response);
                return; // Batalkan request, jangan lanjutkan ke Controller
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Menentukan Identifier Klien:
     * - Jika User membawa JWT valid  -> Key = "user:{username}"
     * - Jika Anonim / Tanpa Token    -> Key = "ip:{client_ip}"
     */
    private String getBucketKey(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            try {
                // Gunakan getEmailFromToken sesuai method di JwtUtil kamu
                String email = jwtUtil.getEmailFromToken(jwt);
                if (email != null && !email.trim().isEmpty()) {
                    return "user:" + email;
                }
            } catch (Exception e) {
                // Jika token invalid/expired/gagal diparse, fallback ke IP Address
            }
        }

        return "ip:" + getClientIP(request);
    }
    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isEmpty()) {
            return xfHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private void sendRateLimitResponse(HttpServletResponse response) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());

        String jsonResponse = """
            {
                "status": 429,
                "error": "Too Many Requests",
                "message": "Terlalu banyak permintaan! Silakan tunggu 1 menit sebelum mencoba kembali."
            }
        """;

        response.getWriter().write(jsonResponse);
    }
}