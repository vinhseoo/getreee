package com.gatre.service.impl;

import com.gatre.dto.admin.AdminCategoryDTO;
import com.gatre.dto.request.CategoryCreateRequest;
import com.gatre.dto.request.CategoryUpdateRequest;
import com.gatre.dto.response.PublicCategoryDTO;
import com.gatre.entity.Category;
import com.gatre.exception.AppException;
import com.gatre.exception.ErrorCode;
import com.gatre.mapper.CategoryMapper;
import com.gatre.repository.CategoryRepository;
import com.gatre.repository.ProductRepository;
import com.gatre.service.AuditLogService;
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
    private final ProductRepository  productRepository;
    private final CategoryMapper     categoryMapper;
    private final AuditLogService    auditLogService;

    @Override
    @Transactional(readOnly = true)
    public List<PublicCategoryDTO> findAllPublic() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toPublicDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminCategoryDTO> findAllAdmin() {
        return categoryRepository.findAll().stream()
                .map(cat -> categoryMapper.toAdminDTO(cat, productRepository.countByCategoryId(cat.getId())))
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
        auditLogService.record("CATEGORY_CREATE", "CATEGORY", saved.getId(),
                "Tạo danh mục: " + saved.getName());
        return categoryMapper.toAdminDTO(saved, 0);
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
        Category saved = categoryRepository.save(category);
        auditLogService.record("CATEGORY_UPDATE", "CATEGORY", saved.getId(),
                "Cập nhật danh mục: " + saved.getName());
        return categoryMapper.toAdminDTO(saved, productRepository.countByCategoryId(saved.getId()));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Category category = findOrThrow(id);
        if (categoryRepository.hasProducts(id)) {
            throw new AppException(ErrorCode.CATEGORY_HAS_PRODUCTS);
        }
        String name = category.getName();
        categoryRepository.delete(category);
        auditLogService.record("CATEGORY_DELETE", "CATEGORY", id, "Xóa danh mục: " + name);
    }

    private Category findOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }
}
