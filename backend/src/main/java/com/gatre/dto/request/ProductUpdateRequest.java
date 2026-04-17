package com.gatre.dto.request;

import com.gatre.entity.enums.ProductStatus;

import java.math.BigDecimal;

// All fields optional — only non-null values are applied
public record ProductUpdateRequest(
        String name,
        String slug,
        String description,
        Long categoryId,
        BigDecimal priceFrom,
        BigDecimal priceTo,
        String featherColor,
        Integer weightGrams,
        Integer ageMonths,
        ProductStatus status
) {}