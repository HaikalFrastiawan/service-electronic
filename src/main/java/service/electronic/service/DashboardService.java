package service.electronic.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import service.electronic.dto.DashboardSummaryResponse;
import service.electronic.entity.ServiceStatus;
import service.electronic.repository.ServiceOrderRepository;
import service.electronic.repository.SparePartRepository;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ServiceOrderRepository serviceOrderRepository;
    private final SparePartRepository sparePartRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary() {
        BigDecimal totalRevenue = serviceOrderRepository.calculateTotalRevenue();

        long pending = serviceOrderRepository.countByStatus(ServiceStatus.PENDING);
        long inRepair = serviceOrderRepository.countByStatus(ServiceStatus.IN_PROGRESS);
        long waitingParts = serviceOrderRepository.countByStatus(ServiceStatus.WAITING_PARTS);
        long completed = serviceOrderRepository.countByStatus(ServiceStatus.COMPLETED);

        long lowStockCount = sparePartRepository.findLowStockParts().size();

        return DashboardSummaryResponse.builder()
                .totalRevenue(totalRevenue)
                .activeOrdersCount(pending + inRepair + waitingParts)
                .inRepairCount(inRepair)
                .waitingPartsCount(waitingParts)
                .completedTodayCount(completed)
                .lowStockPartsCount(lowStockCount)
                .build();
    }
}