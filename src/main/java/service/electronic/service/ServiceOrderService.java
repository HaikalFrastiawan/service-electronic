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

import service.electronic.entity.Role;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceOrderService {

    private final ServiceOrderRepository serviceOrderRepository;
    private final UserRepository userRepository;

    public ServiceOrderResponse createOrder(CreateServiceOrderRequest request, String customerEmail) {
        String effectiveEmail = customerEmail != null && !customerEmail.isBlank() 
                ? customerEmail 
                : request.getCustomerEmail();

        if (effectiveEmail == null || effectiveEmail.isBlank()) {
            effectiveEmail = "guest_" + System.currentTimeMillis() + "@service.com";
        }

        final String finalEmail = effectiveEmail;
        User customer = userRepository.findByEmail(finalEmail)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email(finalEmail)
                            .password("NOPASS")
                            .fullName(request.getCustomerName() != null && !request.getCustomerName().isBlank() 
                                    ? request.getCustomerName() 
                                    : "Pelanggan Guest")
                            .phoneNumber(request.getCustomerPhone())
                            .role(Role.CUSTOMER)
                            .build();
                    return userRepository.save(newUser);
                });

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

    public ServiceOrderResponse getOrderByNumber(String orderNumber) {
        ServiceOrder order = serviceOrderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nomor resi " + orderNumber + " tidak ditemukan"));
        return mapToResponse(order);
    }

    public List<ServiceOrderResponse> getAllOrders() {
        return serviceOrderRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
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
                .deviceId(order.getDevice() != null ? order.getDevice().getId() : null)
                .category(order.getDevice() != null ? order.getDevice().getCategory() : null)
                .brand(order.getDevice() != null ? order.getDevice().getBrand() : null)
                .modelName(order.getDevice() != null ? order.getDevice().getModelName() : null)
                .serialNumber(order.getDevice() != null ? order.getDevice().getSerialNumber() : null)
                .issueDescription(order.getDevice() != null ? order.getDevice().getIssueDescription() : null)
                .customerEmail(order.getCustomer() != null ? order.getCustomer().getEmail() : null)
                .technicianEmail(order.getTechnician() != null ? order.getTechnician().getEmail() : null)
                .build();
    }
}
