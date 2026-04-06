package com.finance.dashboard.dto;

import java.math.BigDecimal;

public record MonthlyTrend(String month, BigDecimal income, BigDecimal expenses) {}
