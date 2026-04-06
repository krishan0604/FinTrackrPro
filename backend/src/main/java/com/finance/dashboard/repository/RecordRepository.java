package com.finance.dashboard.repository;

import com.finance.dashboard.entity.FinancialRecord;
import com.finance.dashboard.enums.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RecordRepository extends JpaRepository<FinancialRecord, Long> {

    @Query("SELECT r FROM FinancialRecord r WHERE r.id = :id AND r.deleted = false")
    Optional<FinancialRecord> findByIdAndNotDeleted(@Param("id") Long id);

    @Query("SELECT r FROM FinancialRecord r WHERE r.deleted = false " +
            "AND (:type IS NULL OR r.type = :type) " +
            "AND (:category IS NULL OR r.category = :category) " +
            "AND (:startDate IS NULL OR r.date >= :startDate) " +
            "AND (:endDate IS NULL OR r.date <= :endDate)")
    Page<FinancialRecord> findWithFilters(
            @Param("type") TransactionType type,
            @Param("category") String category,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);

    @Query("SELECT r FROM FinancialRecord r WHERE r.deleted = false")
    List<FinancialRecord> findAllNotDeleted();

    @Query("SELECT r FROM FinancialRecord r WHERE r.deleted = false ORDER BY r.date DESC, r.id DESC LIMIT 5")
    List<FinancialRecord> findTop5ByDeletedFalseOrderByDateDescIdDesc();
}
