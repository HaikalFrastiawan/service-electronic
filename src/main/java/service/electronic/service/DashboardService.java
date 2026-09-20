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
        // 1. Cek total pendapatan (berikan BigDecimal.ZERO jika hasil SUM null/kosong)
        BigDecimal totalRevenue = serviceOrderRepository.calculateTotalRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        // 2. Hitung jumlah pesanan berdasarkan status
        long pending = serviceOrderRepository.countByStatus(ServiceStatus.PENDING);
        long inRepair = serviceOrderRepository.countByStatus(ServiceStatus.IN_PROGRESS);
        long waitingParts = serviceOrderRepository.countByStatus(ServiceStatus.WAITING_PARTS);
        long completed = serviceOrderRepository.countByStatus(ServiceStatus.COMPLETED);

        // 3. Hitung jumlah sparepart yang stoknya menipis
        long lowStockCount = 0;
        if (sparePartRepository.findLowStockParts() != null) {
            lowStockCount = sparePartRepository.findLowStockParts().size();
        }

        // 4. Buka & kembalikan response DTO
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