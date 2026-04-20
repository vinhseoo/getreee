package com.gatre.dto.admin;

import java.time.Instant;

public record AdminAuditLogDTO(
        Long id,
        Long actorId,
        String actorName,
        String actorEmail,
        String action,
        String entityType,
        Long entityId,
        String summary,
        Instant createdAt
) {}
