package com.finance.dashboard.config;

import com.finance.dashboard.entity.FinancialRecord;
import com.finance.dashboard.entity.User;
import com.finance.dashboard.enums.Role;
import com.finance.dashboard.enums.TransactionType;
import com.finance.dashboard.enums.UserStatus;
import com.finance.dashboard.repository.RecordRepository;
import com.finance.dashboard.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RecordRepository recordRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, RecordRepository recordRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.recordRepository = recordRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User("Admin User", "admin@finance.com", passwordEncoder.encode("admin123"), Role.ADMIN, UserStatus.ACTIVE);
            User analyst = new User("Analyst User", "analyst@finance.com", passwordEncoder.encode("analyst123"), Role.ANALYST, UserStatus.ACTIVE);
            User viewer = new User("Viewer User", "viewer@finance.com", passwordEncoder.encode("viewer123"), Role.VIEWER, UserStatus.ACTIVE);
            
            userRepository.saveAll(Arrays.asList(admin, analyst, viewer));

            LocalDate now = LocalDate.now();

            List<FinancialRecord> records = Arrays.asList(
                    new FinancialRecord(new BigDecimal("5000.00"), TransactionType.INCOME, "Salary", now.minusMonths(1).withDayOfMonth(1), "Monthly Salary", admin),
                    new FinancialRecord(new BigDecimal("1500.00"), TransactionType.EXPENSE, "Rent", now.minusMonths(1).withDayOfMonth(5), "House Rent", admin),
                    new FinancialRecord(new BigDecimal("200.00"), TransactionType.EXPENSE, "Utilities", now.minusMonths(1).withDayOfMonth(10), "Electricity & Water", admin),
                    new FinancialRecord(new BigDecimal("600.00"), TransactionType.EXPENSE, "Food", now.minusMonths(1).withDayOfMonth(15), "Groceries", admin),
                    new FinancialRecord(new BigDecimal("1200.00"), TransactionType.INCOME, "Freelance", now.minusMonths(1).withDayOfMonth(20), "Web Design Project", analyst),
                    
                    new FinancialRecord(new BigDecimal("5000.00"), TransactionType.INCOME, "Salary", now.withDayOfMonth(1), "Monthly Salary", admin),
                    new FinancialRecord(new BigDecimal("1500.00"), TransactionType.EXPENSE, "Rent", now.withDayOfMonth(5), "House Rent", admin),
                    new FinancialRecord(new BigDecimal("300.00"), TransactionType.EXPENSE, "Travel", now.withDayOfMonth(8), "Flight Tickets", analyst),
                    new FinancialRecord(new BigDecimal("800.00"), TransactionType.INCOME, "Investment", now.withDayOfMonth(12), "Dividend", viewer),
                    new FinancialRecord(new BigDecimal("250.00"), TransactionType.EXPENSE, "Utilities", now.withDayOfMonth(15), "Internet & Phone", admin),
                    
                    new FinancialRecord(new BigDecimal("400.00"), TransactionType.EXPENSE, "Marketing", now.minusMonths(2).withDayOfMonth(10), "Facebook Ads", admin),
                    new FinancialRecord(new BigDecimal("5000.00"), TransactionType.INCOME, "Salary", now.minusMonths(2).withDayOfMonth(1), "Monthly Salary", admin),
                    new FinancialRecord(new BigDecimal("900.00"), TransactionType.EXPENSE, "Food", now.minusMonths(2).withDayOfMonth(20), "Dining Out", analyst),
                    new FinancialRecord(new BigDecimal("3000.00"), TransactionType.INCOME, "Freelance", now.minusMonths(3).withDayOfMonth(15), "Consulting", admin),
                    new FinancialRecord(new BigDecimal("1500.00"), TransactionType.EXPENSE, "Rent", now.minusMonths(3).withDayOfMonth(5), "House Rent", admin)
            );

            recordRepository.saveAll(records);
            System.out.println("Seed data initialized.");
        } else if (!userRepository.existsByEmail("viewer@finance.com")) {
            User viewer = new User("Viewer User", "viewer@finance.com", passwordEncoder.encode("viewer123"), Role.VIEWER, UserStatus.ACTIVE);
            userRepository.save(viewer);
            System.out.println("Viewer user appended to existing data.");
        }
    }
}
