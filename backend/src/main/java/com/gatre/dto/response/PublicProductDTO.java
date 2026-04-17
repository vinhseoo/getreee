package com.gatre.dto.response;

import java.util.List;

/**
 * Public product response — price fields are INTENTIONALLY ABSENT.
 * Never add priceFrom or priceTo here. See project-rules.md §1.2.
 */
public record PublicProductDTO(
        Long id,
        String name,
        String slug,
        String description,
        String featherColor,
        Integer weightGrams,
        Integer ageMonths,
        String status,
        PublicCategoryDTO category,
        String primaryMediaUrl,
        List<ProductMediaDTO> media
) {}