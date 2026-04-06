package com.finance.dashboard.service;

import com.finance.dashboard.dto.RoleUpdateRequest;
import com.finance.dashboard.dto.StatusUpdateRequest;
import com.finance.dashboard.dto.UserResponse;
import com.finance.dashboard.entity.User;
import com.finance.dashboard.exception.ResourceNotFoundException;
import com.finance.dashboard.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole(), u.getStatus()))
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole(), u.getStatus());
    }

    public UserResponse updateRole(Long id, RoleUpdateRequest request) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        u.setRole(request.role());
        userRepository.save(u);
        return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole(), u.getStatus());
    }

    public UserResponse updateStatus(Long id, StatusUpdateRequest request) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        u.setStatus(request.status());
        userRepository.save(u);
        return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole(), u.getStatus());
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }
}
