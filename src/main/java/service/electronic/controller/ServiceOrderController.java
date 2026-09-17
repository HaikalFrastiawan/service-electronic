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

import java.util.List;

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
        String customerEmail = authentication != null ? authentication.getName() : null;
        ServiceOrderResponse response = serviceOrderService.createOrder(request, customerEmail);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                WebResponse.<ServiceOrderResponse>builder()
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/track/{orderNumber}")
    public ResponseEntity<WebResponse<ServiceOrderResponse>> trackOrder(@PathVariable String orderNumber) {
        ServiceOrderResponse response = serviceOrderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(
                WebResponse.<ServiceOrderResponse>builder()
                        .data(response)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<WebResponse<List<ServiceOrderResponse>>> getAllOrders() {
        List<ServiceOrderResponse> responses = serviceOrderService.getAllOrders();
        return ResponseEntity.ok(
                WebResponse.<List<ServiceOrderResponse>>builder()
                        .data(responses)
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