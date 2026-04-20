package com.gatre.dto.request;

import jakarta.validation.constraints.NotBlank;

public record PostMessageRequest(
        @NotBlank String content,
        Long productId
) {}
