package service.electronic.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimiterFilter extends OncePerRequestFilter {

    // Simpan bucket per IP Address di RAM (In-Memory)
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    // Membuat aturan Bucket: Maksimal 10 request per 1 menit
    private Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Hanya terapkan Rate Limiter pada endpoint API (/api/v1/...)
        if (path.startsWith("/api/")) {
            String clientIp = getClientIP(request);

            // Ambil bucket milik IP ini, atau buatkan baru jika belum ada
            Bucket bucket = cache.computeIfAbsent(clientIp, k -> createNewBucket());

            // Coba konsumsi 1 token
            if (!bucket.tryConsume(1)) {
                // Jika token habis, kirim respon HTTP 429
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.getWriter().write("""
                    {
                        "status": 429,
                        "error": "Too Many Requests",
                        "message": "Terlalu banyak permintaan! Silakan tunggu 1 menit sebelum mencoba kembali."
                    }
                """);
                return; // Stop request, jangan teruskan ke Controller
            }
        }

        filterChain.doFilter(request, response);
    }

    // Mengambil IP asli klien jika dibelakang Proxy / Load Balancer
    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}