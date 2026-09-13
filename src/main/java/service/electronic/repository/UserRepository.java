package service.electronic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import service.electronic.entity.User;

import java.util.Optional;

@Repository
public interface UserRepository  extends JpaRepository<User, String>{
    // ngecek email sudah terdaftar (digunakan saat registrasi)
    boolean existsByEmail(String email);

    // cari user berdasarkan email (digunakan saat login)
    Optional<User> findByEmail(String email);
}
