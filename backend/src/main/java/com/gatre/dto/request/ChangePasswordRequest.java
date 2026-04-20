package com.gatre.dto.request;

public record ChangePasswordRequest(
        String currentPassword,
        String newPassword
) {}
