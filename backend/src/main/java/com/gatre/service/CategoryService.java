package com.gatre.service;

import com.gatre.dto.admin.AdminCategoryDTO;
import com.gatre.dto.request.CategoryCreateRequest;
import com.gatre.dto.request.CategoryUpdateRequest;
import com.gatre.dto.response.PublicCategoryDTO;

import java.util.List;

public interface CategoryService {
    List<PublicCategoryDTO> findAllPublic();
    List<AdminCategoryDTO> findAllAdmin();
    AdminCategoryDTO create(CategoryCreateRequest request);
    AdminCategoryDTO update(Long id, CategoryUpdateRequest request);
    void delete(Long id);
}