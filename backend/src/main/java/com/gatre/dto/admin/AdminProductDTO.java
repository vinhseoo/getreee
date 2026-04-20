package com.gatre.dto.admin;

import com.gatre.dto.response.PublicCategoryDTO;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Admin-only product DTO — includes priceFrom and priceTo.
 * MUST NEVER be returned from any public or user-facing endpoint.
 */
public record AdminProductDTO(
        Long id,
        String productCode,
        String name,
        String slug,
        String description,
        BigDecimal priceFrom,   // ADMIN ONLY
        BigDecimal priceTo,     // ADMIN ONLY
        String featherColor,
        Integer weightGrams,
        Integer ageMonths,
        String vaccinationStatus,
        String characterTraits,
        String status,
        PublicCategoryDTO category,
        String primaryMediaUrl,
        List<AdminProductMediaDTO> media,
        Instant createdAt,
        Instant updatedAt
) {}