package service.electronic.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import service.electronic.dto.CreateServiceOrderRequest;
import service.electronic.dto.ServiceOrderResponse;
import service.electronic.dto.UpdateServiceStatusRequest;
import service.electronic.entity.ElectronicDevice;
import service.electronic.entity.ServiceOrder;
import service.electronic.entity.ServiceStatus;
import service.electronic.entity.User;
import service.electronic.repository.ServiceOrderRepository;
import service.electronic.repository.UserRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ServiceOrderService {

    private final ServiceOrderRepository serviceOrderRepository;
    private final UserRepository userRepository;

    public ServiceOrderResponse createOrder(CreateServiceOrderRequest request, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer tidak ditemukan"));

        ElectronicDevice device = ElectronicDevice.builder()
                .category(request.getCategory())
                .brand(request.getBrand())
                .modelName(request.getModelName())
                .serialNumber(request.getSerialNumber())
                .issueDescription(request.getIssueDescription())
                .owner(customer)
                .build();

        String generatedOrderNumber = "SVC-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
                .concat("-")
                .concat(UUID.randomUUID().toString().substring(0, 4).toUpperCase());

        ServiceOrder order = ServiceOrder.builder()
                .orderNumber(generatedOrderNumber)
                .customer(customer)
                .device(device)
                .status(ServiceStatus.PENDING)
                .build();

        ServiceOrder savedOrder = serviceOrderRepository.save(order);
        return mapToResponse(savedOrder);
    }

    @Transactional
    public ServiceOrderResponse updateOrderStatus(String orderId, UpdateServiceStatusRequest request) {
        ServiceOrder order = serviceOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pesanan servis tidak ditemukan"));

        if (request.getStatus() != null) {
            order.setStatus(request.getStatus());
        }
        if (request.getEstimatedCost() != null) {
            order.setEstimatedCost(request.getEstimatedCost());
        }
        if (request.getTotalCost() != null) {
            order.setTotalCost(request.getTotalCost());
        }
        if (request.getCompletionNotes() != null) {
            order.setCompletionNotes(request.getCompletionNotes());
        }
        if (request.getTechnicianId() != null) {
            User technician = userRepository.findById(request.getTechnicianId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teknisi tidak ditemukan"));
            order.setTechnician(technician);
        }

        ServiceOrder updatedOrder = serviceOrderRepository.save(order);
        return mapToResponse(updatedOrder);
    }

    private ServiceOrderResponse mapToResponse(ServiceOrder order) {
        return ServiceOrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus())
                .estimatedCost(order.getEstimatedCost())
                .totalCost(order.getTotalCost())
                .completionNotes(order.getCompletionNotes())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .deviceId(order.getDevice().getId())
                .category(order.getDevice().getCategory())
                .brand(order.getDevice().getBrand())
                .modelName(order.getDevice().getModelName())
                .serialNumber(order.getDevice().getSerialNumber())
                .issueDescription(order.getDevice().getIssueDescription())
                .customerEmail(order.getCustomer().getEmail())
                .technicianEmail(order.getTechnician() != null ? order.getTechnician().getEmail() : null)
                .build();
    }
}
