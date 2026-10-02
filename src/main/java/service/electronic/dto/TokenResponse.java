package service.electronic.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenResponse {

    private String token;

    @Builder.Default
    private String tokenType = "Bearer";
}