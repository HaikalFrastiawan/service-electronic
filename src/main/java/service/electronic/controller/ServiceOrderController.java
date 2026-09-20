package service.electronic.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.electronic.dto.*;
import service.electronic.service.ServiceOrderService;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/service-orders", "/api/service-orders"})
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ServiceOrderController {

    private final ServiceOrderService serviceOrderService;

    @PostMapping
    public ResponseEntity<WebResponse<ServiceOrderResponse>> createOrder(
            @Valid @RequestBody CreateServiceOrderRequest request,
            @RequestAttribute(value = "email", required = false) String email) {
        ServiceOrderResponse response = serviceOrderService.createOrder(request, email);
        return ResponseEntity.ok(
                WebResponse.<ServiceOrderResponse>builder()
                        .success(true)
                        .message("Pesanan servis berhasil dibuat")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/track/{orderNumber}")
    public ResponseEntity<WebResponse<ServiceOrderResponse>> getOrderByNumber(@PathVariable String orderNumber) {
        ServiceOrderResponse response = serviceOrderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(
                WebResponse.<ServiceOrderResponse>builder()
                        .success(true)
                        .message("Data pesanan ditemukan")
                        .data(response)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<WebResponse<List<ServiceOrderResponse>>> getAllOrders() {
        List<ServiceOrderResponse> response = serviceOrderService.getAllOrders();
        return ResponseEntity.ok(
                WebResponse.<List<ServiceOrderResponse>>builder()
                        .success(true)
                        .message("Daftar pesanan servis berhasil diambil")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<WebResponse<ServiceOrderResponse>> updateOrderStatus(
            @PathVariable String orderId,
            @Valid @RequestBody UpdateServiceStatusRequest request
    ) {
        // 1. Update Status & Biaya Pengerjaan
        ServiceOrderResponse response = serviceOrderService.updateOrderStatus(orderId, request);

        // 2. Jika ada sparepart yang dipilih dari modal, langsung potong stok & tambahkan ke order
        if (request.getSparePartId() != null && request.getQuantity() != null && request.getQuantity() > 0) {
            response = serviceOrderService.addSparePartToOrder(orderId, request.getSparePartId(), request.getQuantity());
        }

        return ResponseEntity.ok(
                WebResponse.<ServiceOrderResponse>builder()
                        .success(true)
                        .message("Status pesanan berhasil diperbarui")
                        .data(response)
                        .build()
        );
    }

    @PostMapping("/{orderId}/parts")
    public ResponseEntity<WebResponse<ServiceOrderResponse>> addSparePartToOrder(
            @PathVariable String orderId,
            @RequestBody AddServicePartRequest request
    ) {
        ServiceOrderResponse response = serviceOrderService.addSparePartToOrder(
                orderId,
                request.getSparePartId(),
                request.getQuantity()
        );
        return ResponseEntity.ok(
                WebResponse.<ServiceOrderResponse>builder()
                        .success(true)
                        .message("Sparepart berhasil ditambahkan ke pesanan")
                        .data(response)
                        .build()
        );
    }
}