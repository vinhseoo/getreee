package com.gatre.dto.response;

public record AuthResponseDTO(
        String accessToken,
        long expiresIn
) {}