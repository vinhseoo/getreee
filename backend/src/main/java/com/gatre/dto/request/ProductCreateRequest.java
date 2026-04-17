package com.gatre.dto.request;

import com.gatre.entity.enums.ProductStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ProductCreateRequest(
        @NotBlank(message = "Tên sản phẩm không được để trống") String name,
        String description,
        @NotNull(message = "Danh mục không được để trống") Long categoryId,
        BigDecimal priceFrom,
        BigDecimal priceTo,
        String featherColor,
        Integer weightGrams,
        Integer ageMonths,
        ProductStatus status    // defaults to AVAILABLE in service if null
) {}