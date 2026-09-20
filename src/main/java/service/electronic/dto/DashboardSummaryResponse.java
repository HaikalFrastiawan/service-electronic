package service.electronic.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DashboardSummaryResponse {
    private BigDecimal totalRevenue;
    private long activeOrdersCount;
    private long inRepairCount;
    private long waitingPartsCount;
    private long completedTodayCount;
    private long lowStockPartsCount;
}