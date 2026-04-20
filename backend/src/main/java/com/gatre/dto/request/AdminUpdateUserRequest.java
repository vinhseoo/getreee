package com.gatre.dto.request;

import com.gatre.entity.enums.Role;

public record AdminUpdateUserRequest(
        String name,
        Role role,
        Boolean active
) {}
