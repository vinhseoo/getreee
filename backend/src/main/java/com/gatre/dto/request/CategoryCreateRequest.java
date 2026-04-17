package com.gatre.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CategoryCreateRequest(
        @NotBlank(message = "Tên danh mục không được để trống") String name,
        String description
) {}