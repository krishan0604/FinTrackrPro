package com.finance.dashboard.dto;

import java.math.BigDecimal;

public record DashboardSummary(
        BigDecimal totalIncome,
        BigDecimal totalExpenses,
        BigDecimal netBalance,
        long totalRecords
) {}
