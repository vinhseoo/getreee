package com.gatre.dto.response;

import java.time.Instant;

public record ChatMessageDTO(
        Long id,
        Long conversationId,
        Long senderId,
        String senderName,
        String senderAvatarUrl,
        String content,
        boolean read,
        ProductSnapshotDTO productSnapshot,
        Instant createdAt
) {}