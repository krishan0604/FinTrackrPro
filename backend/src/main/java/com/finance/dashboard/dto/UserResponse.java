package com.finance.dashboard.dto;

import com.finance.dashboard.enums.Role;
import com.finance.dashboard.enums.UserStatus;

public record UserResponse(
        Long id,
        String name,
        String email,
        Role role,
        UserStatus status
) {}
