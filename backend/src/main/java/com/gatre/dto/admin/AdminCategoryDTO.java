package com.gatre.dto.admin;

import java.time.Instant;

public record AdminCategoryDTO(
        Long id,
        String name,
        String slug,
        String description,
        Instant createdAt,
        Instant updatedAt,
        long productCount
) {}