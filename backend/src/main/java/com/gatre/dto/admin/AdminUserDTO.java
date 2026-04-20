package com.gatre.dto.admin;

import com.gatre.entity.enums.AuthProvider;
import com.gatre.entity.enums.Role;

import java.time.Instant;

public record AdminUserDTO(
        Long id,
        String name,
        String email,
        String avatarUrl,
        Role role,
        AuthProvider provider,
        boolean active,
        Instant createdAt
) {}
