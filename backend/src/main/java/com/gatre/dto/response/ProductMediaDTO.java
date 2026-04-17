package com.gatre.dto.response;

public record ProductMediaDTO(
        Long id,
        String mediaUrl,
        String mediaType,
        boolean primary,
        int displayOrder
) {}