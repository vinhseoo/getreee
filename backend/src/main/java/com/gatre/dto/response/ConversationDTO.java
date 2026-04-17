package com.gatre.dto.response;

import java.time.Instant;

public record ConversationDTO(
        Long id,
        Long userId,
        String userName,
        String userAvatarUrl,
        Instant lastMessageAt,
        long unreadCount
) {}