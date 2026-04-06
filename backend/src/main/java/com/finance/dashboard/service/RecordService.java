package com.finance.dashboard.service;

import com.finance.dashboard.dto.RecordRequest;
import com.finance.dashboard.entity.FinancialRecord;
import com.finance.dashboard.entity.User;
import com.finance.dashboard.enums.TransactionType;
import com.finance.dashboard.exception.ResourceNotFoundException;
import com.finance.dashboard.repository.RecordRepository;
import com.finance.dashboard.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class RecordService {

    private final RecordRepository recordRepository;
    private final UserRepository userRepository;

    public RecordService(RecordRepository recordRepository, UserRepository userRepository) {
        this.recordRepository = recordRepository;
        this.userRepository = userRepository;
    }

    public FinancialRecord createRecord(RecordRequest request) {
        User currentUser = getCurrentUser();
        FinancialRecord record = new FinancialRecord(
                request.amount(),
                request.type(),
                request.category(),
                request.date(),
                request.description(),
                currentUser
        );
        return recordRepository.save(record);
    }

    public Page<FinancialRecord> getRecords(TransactionType type, String category, LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return recordRepository.findWithFilters(type, category, startDate, endDate, pageable);
    }

    public FinancialRecord getRecordById(Long id) {
        return recordRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Record not found"));
    }

    public FinancialRecord updateRecord(Long id, RecordRequest request) {
        FinancialRecord record = getRecordById(id);
        record.setAmount(request.amount());
        record.setType(request.type());
        record.setCategory(request.category());
        record.setDate(request.date());
        record.setDescription(request.description());
        return recordRepository.save(record);
    }

    public void deleteRecord(Long id) {
        FinancialRecord record = getRecordById(id);
        record.setDeleted(true);
        recordRepository.save(record);
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
