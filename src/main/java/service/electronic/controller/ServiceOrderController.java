package service.electronic.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import service.electronic.dto.*;
import service.electronic.service.ServiceOrderService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/service-orders")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
@RequiredArgsConstructor
public class ServiceOrderController {

    private final ServiceOrderService serviceOrderService;

    @PostMapping
    public ResponseEntity<WebResponse<ServiceOrderResponse>> createOrder(
            @Valid @RequestBody CreateServiceOrderRequest request,
            Authentication authentication
    ) {
        String authenticatedEmail = (authentication != null && authentication.isAuthenticated())
                ? authentication.getName()
                : null;

        ServiceOrderResponse response = serviceOrderService.createOrder(request, authenticatedEmail);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                WebResponse.<ServiceOrderResponse>builder()
                        .success(true)
                        .message("Pesanan servis berhasil dibuat")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/track/{orderNumber}")
    public ResponseEntity<WebResponse<ServiceOrderResponse>> trackOrder(@PathVariable String orderNumber) {
        ServiceOrderResponse response = serviceOrderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(
                WebResponse.<ServiceOrderResponse>builder()
                        .success(true)
                        .data(response)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<WebResponse<List<ServiceOrderResponse>>> getAllOrders() {
        List<ServiceOrderResponse> responses = serviceOrderService.getAllOrders();
        return ResponseEntity.ok(
                WebResponse.<List<ServiceOrderResponse>>builder()
                        .success(true)
                        .data(responses)
                        .build()
        );
    }

    // MENGGUNAKAN @PutMapping Sesuai Request Frontend
    @PutMapping("/{orderId}/status")
    public ResponseEntity<WebResponse<ServiceOrderResponse>> updateOrderStatus(
            @PathVariable String orderId,
            @Valid @RequestBody UpdateServiceStatusRequest request
    ) {
        ServiceOrderResponse response = serviceOrderService.updateOrderStatus(orderId, request);

        return ResponseEntity.ok(
                WebResponse.<ServiceOrderResponse>builder()
                        .success(true)
                        .message("Status pesanan berhasil diperbarui")
                        .data(response)
                        .build()
        );
    }

    @PostMapping("/{orderId}/parts")
    public ResponseEntity<ServiceOrderResponse> addSparePartToOrder(
            @PathVariable String orderId,
            @RequestBody AddServicePartRequest request) {
        return ResponseEntity.ok(serviceOrderService.addSparePartToOrder(orderId, request.getSparePartId(), request.getQuantity()));
    }
}