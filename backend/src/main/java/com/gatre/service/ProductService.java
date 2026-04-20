package com.gatre.service;

import com.gatre.dto.admin.AdminProductDTO;
import com.gatre.dto.admin.AdminProductMediaDTO;
import com.gatre.dto.request.ProductCreateRequest;
import com.gatre.dto.request.ProductUpdateRequest;
import com.gatre.dto.response.PageResponse;
import com.gatre.dto.response.PublicProductDTO;
import com.gatre.entity.enums.ProductStatus;
import com.gatre.security.UserPrincipal;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface ProductService {

    // Public
    PageResponse<PublicProductDTO> findPublicProducts(Long categoryId, String featherColor, String keyword, Pageable pageable);
    PublicProductDTO findBySlugPublic(String slug);

    // Admin — product CRUD
    PageResponse<AdminProductDTO> findAllAdmin(String keyword, Pageable pageable);
    AdminProductDTO findByIdAdmin(Long id);
    AdminProductDTO create(ProductCreateRequest request, UserPrincipal principal);
    AdminProductDTO update(Long id, ProductUpdateRequest request);
    AdminProductDTO updateStatus(Long id, ProductStatus status);
    void delete(Long id);

    // Admin — media management
    AdminProductMediaDTO uploadMedia(Long productId, MultipartFile file);
    void setPrimaryMedia(Long productId, Long mediaId);
    void deleteMedia(Long productId, Long mediaId);
}