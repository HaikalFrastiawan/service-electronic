package service.electronic.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryResponse {

    private BigDecimal totalRevenue;
    private long activeOrdersCount;
    private long inRepairCount;
    private long waitingPartsCount;
    private long completedTodayCount;
    private long lowStockPartsCount;
}