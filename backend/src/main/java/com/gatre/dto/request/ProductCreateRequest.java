package com.gatre.dto.request;

import com.gatre.entity.enums.ProductStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ProductCreateRequest(
        @NotBlank(message = "Tên sản phẩm không được để trống") String name,
        String productCode,
        String description,
        @NotNull(message = "Danh mục không được để trống") Long categoryId,
        BigDecimal priceFrom,
        BigDecimal priceTo,
        String featherColor,
        Integer weightGrams,
        Integer ageMonths,
        String vaccinationStatus,
        String characterTraits,
        ProductStatus status    // defaults to AVAILABLE in service if null
) {}