package service.electronic.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import service.electronic.entity.Role;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private String id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    private Role role;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
}