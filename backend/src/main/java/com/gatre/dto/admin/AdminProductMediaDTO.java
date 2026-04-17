package com.gatre.dto.admin;

public record AdminProductMediaDTO(
        Long id,
        String mediaUrl,
        String mediaType,
        boolean primary,
        String cloudinaryPublicId,
        int displayOrder
) {}