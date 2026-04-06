package com.finance.dashboard.service;

import com.finance.dashboard.dto.CategoryTotal;
import com.finance.dashboard.dto.DashboardSummary;
import com.finance.dashboard.dto.MonthlyTrend;
import com.finance.dashboard.entity.FinancialRecord;
import com.finance.dashboard.enums.TransactionType;
import com.finance.dashboard.repository.RecordRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final RecordRepository recordRepository;

    public DashboardService(RecordRepository recordRepository) {
        this.recordRepository = recordRepository;
    }

    public DashboardSummary getSummary() {
        List<FinancialRecord> records = recordRepository.findAllNotDeleted();
        
        BigDecimal totalIncome = records.stream()
                .filter(r -> r.getType() == TransactionType.INCOME)
                .map(FinancialRecord::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpenses = records.stream()
                .filter(r -> r.getType() == TransactionType.EXPENSE)
                .map(FinancialRecord::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal netBalance = totalIncome.subtract(totalExpenses);

        return new DashboardSummary(totalIncome, totalExpenses, netBalance, records.size());
    }

    public List<CategoryTotal> getCategoryTotals() {
        List<FinancialRecord> records = recordRepository.findAllNotDeleted();
        Map<String, BigDecimal> categoryMap = records.stream()
                .collect(Collectors.groupingBy(
                        FinancialRecord::getCategory,
                        Collectors.mapping(FinancialRecord::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));

        return categoryMap.entrySet().stream()
                .map(e -> new CategoryTotal(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }

    public List<MonthlyTrend> getMonthlyTrends() {
        List<FinancialRecord> records = recordRepository.findAllNotDeleted();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        Map<String, List<FinancialRecord>> byMonth = records.stream()
                .collect(Collectors.groupingBy(r -> r.getDate().format(formatter)));

        return byMonth.entrySet().stream()
                .map(e -> {
                    BigDecimal income = e.getValue().stream()
                            .filter(r -> r.getType() == TransactionType.INCOME)
                            .map(FinancialRecord::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    BigDecimal exp = e.getValue().stream()
                            .filter(r -> r.getType() == TransactionType.EXPENSE)
                            .map(FinancialRecord::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return new MonthlyTrend(e.getKey(), income, exp);
                })
                .sorted((a, b) -> a.month().compareTo(b.month()))
                .collect(Collectors.toList());
    }

    public List<FinancialRecord> getRecentActivity() {
        return recordRepository.findTop5ByDeletedFalseOrderByDateDescIdDesc();
    }
}
