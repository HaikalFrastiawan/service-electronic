package service.electronic.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WebResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private Object errors;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    public static <T> WebResponse<T> success(T data, String message) {
        return WebResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> WebResponse<T> success(T data) {
        return success(data, "Sukses");
    }

    public static <T> WebResponse<T> error(String message, Object errors) {
        return WebResponse.<T>builder()
                .success(false)
                .message(message)
                .errors(errors)
                .build();
    }

    public static <T> WebResponse<T> error(String message) {
        return error(message, null);
    }
}