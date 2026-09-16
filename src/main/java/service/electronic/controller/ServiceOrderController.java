package service.electronic.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import service.electronic.dto.CreateServiceOrderRequest;
import service.electronic.dto.ServiceOrderResponse;
import service.electronic.dto.UpdateServiceStatusRequest;
import service.electronic.dto.WebResponse;
import service.electronic.service.ServiceOrderService;

@RestController
@RequestMapping("/api/v1/service-orders")
@RequiredArgsConstructor
public class ServiceOrderController {

    private final ServiceOrderService serviceOrderService;

    @PostMapping
    public ResponseEntity<WebResponse<ServiceOrderResponse>> createOrder(
            @Valid @RequestBody CreateServiceOrderRequest request,
            Authentication authentication
    ) {
        String customerEmail = authentication.getName();
        ServiceOrderResponse response = serviceOrderService.createOrder(request, customerEmail);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                WebResponse.<ServiceOrderResponse>builder()
                        .data(response)
                        .build()
        );
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<WebResponse<ServiceOrderResponse>> updateOrderStatus(
            @PathVariable String orderId,
            @Valid @RequestBody UpdateServiceStatusRequest request
    ) {
        ServiceOrderResponse response = serviceOrderService.updateOrderStatus(orderId, request);

        return ResponseEntity.ok(
                WebResponse.<ServiceOrderResponse>builder()
                        .data(response)
                        .build()
        );
    }
}