package service.electronic.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;
import service.electronic.dto.WebResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<WebResponse<Object>> handleResponseStatusException(ResponseStatusException ex) {
        return ResponseEntity.status(ex.getStatusCode()).body(
                WebResponse.builder()
                        .success(false)
                        .message(ex.getReason())
                        .data(null)
                        .build()
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<WebResponse<Object>> handleGenericException(Exception ex) {
        return ResponseEntity.status(500).body(
                WebResponse.builder()
                        .success(false)
                        .message("Terjadi kesalahan internal server: " + ex.getMessage())
                        .data(null)
                        .build()
        );
    }
}