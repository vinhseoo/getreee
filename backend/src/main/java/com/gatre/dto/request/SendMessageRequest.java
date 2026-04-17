package com.gatre.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SendMessageRequest(
        @NotNull Long conversationId,
        @NotBlank String content,
        Long productId  // nullable — attaches a product card to the message
) {}