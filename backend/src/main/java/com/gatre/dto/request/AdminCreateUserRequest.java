package com.gatre.dto.request;

import com.gatre.entity.enums.Role;

public record AdminCreateUserRequest(
        String name,
        String email,
        String password,
        Role role
) {}
