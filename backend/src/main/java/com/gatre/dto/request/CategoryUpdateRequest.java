package com.gatre.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CategoryUpdateRequest(
        @NotBlank(message = "Tên danh mục không được để trống") String name,
        String slug,            // optional — regenerated from name if null
        String description
) {}