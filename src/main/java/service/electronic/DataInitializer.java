package service.electronic;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import service.electronic.entity.Role;
import service.electronic.entity.User;
import service.electronic.repository.UserRepository;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        seedAdminAccount();
    }

    private void seedAdminAccount() {
        String adminEmail = "admin@electrofix.com";
        if (userRepository.findByEmail(adminEmail).isPresent()) {
            log.info("[DataInitializer] Akun admin sudah ada, skip.");
            return;
        }

        User admin = User.builder()
                .email(adminEmail)
                .password(passwordEncoder.encode("admin123"))
                .fullName("Administrator ElectroFix")
                .phoneNumber("081200000001")
                .address("Kantor Pusat ElectroFix")
                .role(Role.ROLE_ADMIN)
                .build();

        userRepository.save(admin);
        log.info("[DataInitializer] Akun admin berhasil dibuat: {}", adminEmail);
    }
}