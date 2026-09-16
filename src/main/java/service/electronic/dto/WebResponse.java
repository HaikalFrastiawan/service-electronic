package service.electronic.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebResponse<T> {
    private boolean success;
    private String message;
    private T data;

    private Object errors;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
