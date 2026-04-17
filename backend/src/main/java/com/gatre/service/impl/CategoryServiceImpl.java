package com.gatre.service.impl;

import com.gatre.dto.admin.AdminCategoryDTO;
import com.gatre.dto.request.CategoryCreateRequest;
import com.gatre.dto.request.CategoryUpdateRequest;
import com.gatre.dto.response.PublicCategoryDTO;
import com.gatre.entity.Category;
import com.gatre.exception.AppException;
import com.gatre.exception.ErrorCode;
import com.gatre.repository.CategoryRepository;
import com.gatre.service.CategoryService;
import com.gatre.util.SlugUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PublicCategoryDTO> findAllPublic() {
        return categoryRepository.findAll().stream()
                .map(c -> new PublicCategoryDTO(c.getId(), c.getName(), c.getSlug()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminCategoryDTO> findAllAdmin() {
        return categoryRepository.findAll().stream()
                .map(this::toAdminDTO)
                .toList();
    }

    @Override
    @Transactional
    public AdminCategoryDTO create(CategoryCreateRequest request) {
        String slug = SlugUtils.toSlug(request.name());
        if (categoryRepository.existsBySlug(slug)) {
            throw new AppException(ErrorCode.SLUG_ALREADY_EXISTS);
        }
        Category saved = categoryRepository.save(Category.builder()
                .name(request.name())
                .slug(slug)
                .description(request.description())
                .build());
        return toAdminDTO(saved);
    }

    @Override
    @Transactional
    public AdminCategoryDTO update(Long id, CategoryUpdateRequest request) {
        Category category = findOrThrow(id);
        String slug = request.slug() != null
                ? request.slug()
                : SlugUtils.toSlug(request.name());

        if (!slug.equals(category.getSlug()) && categoryRepository.existsBySlug(slug)) {
            throw new AppException(ErrorCode.SLUG_ALREADY_EXISTS);
        }
        category.setName(request.name());
        category.setSlug(slug);
        category.setDescription(request.description());
        return toAdminDTO(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Category category = findOrThrow(id);
        if (categoryRepository.hasProducts(id)) {
            throw new AppException(ErrorCode.CATEGORY_HAS_PRODUCTS);
        }
        categoryRepository.delete(category);
    }

    private Category findOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    private AdminCategoryDTO toAdminDTO(Category c) {
        return new AdminCategoryDTO(
                c.getId(), c.getName(), c.getSlug(),
                c.getDescription(), c.getCreatedAt(), c.getUpdatedAt());
    }
}