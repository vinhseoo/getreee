package com.gatre.dto.response;

import com.gatre.entity.enums.AuthProvider;
import com.gatre.entity.enums.Role;

public record UserProfileDTO(
        Long id,
        String name,
        String email,
        String avatarUrl,
        Role role,
        AuthProvider provider
) {}