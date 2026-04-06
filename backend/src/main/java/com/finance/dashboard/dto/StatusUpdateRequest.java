package com.finance.dashboard.dto;

import com.finance.dashboard.enums.UserStatus;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(@NotNull UserStatus status) {}
