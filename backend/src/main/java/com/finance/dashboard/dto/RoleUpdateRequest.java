package com.finance.dashboard.dto;

import com.finance.dashboard.enums.Role;
import jakarta.validation.constraints.NotNull;

public record RoleUpdateRequest(@NotNull Role role) {}
