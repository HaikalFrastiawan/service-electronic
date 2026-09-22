package service.electronic.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetPasswordEmail(String toEmail, String resetToken) {
        String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("electrofix.pro.app@gmail.com"); // Samakan dengan properties
        message.setTo(toEmail);
        message.setSubject("Reset Password - ElectroFix PRO");
        message.setText("Halo,\n\n"
                + "Kami menerima permintaan untuk mereset kata sandi akun ElectroFix Anda.\n"
                + "Silakan klik tautan di bawah ini untuk membuat kata sandi baru:\n\n"
                + resetLink + "\n\n"
                + "Jika Anda tidak meminta pengaturan ulang ini, abaikan saja email ini.\n\n"
                + "Salam,\nTim ElectroFix PRO");

        mailSender.send(message);
    }
}