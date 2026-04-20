package com.gatre.service.impl;

import com.gatre.dto.admin.AdminProductDTO;
import com.gatre.dto.admin.AdminProductMediaDTO;
import com.gatre.dto.request.ProductCreateRequest;
import com.gatre.dto.request.ProductUpdateRequest;
import com.gatre.dto.response.PageResponse;
import com.gatre.dto.response.PublicProductDTO;
import com.gatre.entity.Category;
import com.gatre.entity.Product;
import com.gatre.entity.ProductMedia;
import com.gatre.entity.User;
import com.gatre.entity.enums.MediaType;
import com.gatre.entity.enums.ProductStatus;
import com.gatre.exception.AppException;
import com.gatre.exception.ErrorCode;
import com.gatre.mapper.ProductMapper;
import com.gatre.repository.CategoryRepository;
import com.gatre.repository.ProductMediaRepository;
import com.gatre.repository.ProductRepository;
import com.gatre.repository.UserRepository;
import com.gatre.repository.spec.ProductSpecification;
import com.gatre.security.UserPrincipal;
import com.gatre.service.AuditLogService;
import com.gatre.service.CloudinaryService;
import com.gatre.service.ProductService;
import com.gatre.util.SlugUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository      productRepository;
    private final ProductMediaRepository productMediaRepository;
    private final CategoryRepository     categoryRepository;
    private final UserRepository         userRepository;
    private final CloudinaryService      cloudinaryService;
    private final ProductMapper          productMapper;
    private final AuditLogService        auditLogService;

    // ── Public ───────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PublicProductDTO> findPublicProducts(
            Long categoryId, String featherColor, String keyword, Pageable pageable) {

        Specification<Product> spec = Specification
                .where(ProductSpecification.hasStatus(ProductStatus.AVAILABLE))
                .and(ProductSpecification.hasCategoryId(categoryId))
                .and(ProductSpecification.hasFeatherColor(featherColor))
                .and(ProductSpecification.hasKeyword(keyword));

        Page<Product> page = productRepository.findAll(spec, pageable);
        Map<Long, String> primaryUrls = batchFetchPrimaryUrls(
                page.getContent().stream().map(Product::getId).toList());

        return PageResponse.from(page.map(p ->
                productMapper.toPublicListDTO(p, primaryUrls.get(p.getId()))));
    }

    @Override
    @Transactional
    public PublicProductDTO findBySlugPublic(String slug) {
        Product product = productRepository.findBySlug(slug)
                .filter(p -> p.getStatus() == ProductStatus.AVAILABLE)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        productRepository.incrementViewCount(product.getId());
        product.setViewCount(product.getViewCount() + 1);

        List<ProductMedia> media = productMediaRepository
                .findByProductIdOrderByDisplayOrderAsc(product.getId());

        return productMapper.toPublicDetailDTO(product,
                getPrimaryUrl(media),
                media.stream().map(productMapper::toPublicMediaDTO).toList());
    }

    // ── Admin — Products ─────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AdminProductDTO> findAllAdmin(String keyword, Pageable pageable) {
        Specification<Product> spec = ProductSpecification.hasKeyword(keyword);
        Page<Product> page = productRepository.findAll(spec, pageable);
        Map<Long, String> primaryUrls = batchFetchPrimaryUrls(
                page.getContent().stream().map(Product::getId).toList());
        return PageResponse.from(page.map(p ->
                productMapper.toAdminListDTO(p, primaryUrls.get(p.getId()))));
    }

    @Override
    @Transactional(readOnly = true)
    public AdminProductDTO findByIdAdmin(Long id) {
        Product product = findProductOrThrow(id);
        List<ProductMedia> media = productMediaRepository
                .findByProductIdOrderByDisplayOrderAsc(id);
        return toAdminDetailDTO(product, media);
    }

    @Override
    @Transactional
    public AdminProductDTO create(ProductCreateRequest req, UserPrincipal principal) {
        String slug = SlugUtils.toSlug(req.name());
        if (productRepository.existsBySlug(slug)) {
            throw new AppException(ErrorCode.SLUG_ALREADY_EXISTS);
        }
        Category category = findCategoryOrThrow(req.categoryId());
        User creator = userRepository.findById(principal.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Product saved = productRepository.save(Product.builder()
                .name(req.name())
                .slug(slug)
                .productCode(req.productCode())
                .description(req.description())
                .category(category)
                .createdBy(creator)
                .priceFrom(req.priceFrom())
                .priceTo(req.priceTo())
                .featherColor(req.featherColor())
                .weightGrams(req.weightGrams())
                .ageMonths(req.ageMonths())
                .vaccinationStatus(req.vaccinationStatus())
                .characterTraits(req.characterTraits())
                .status(req.status() != null ? req.status() : ProductStatus.AVAILABLE)
                .build());

        auditLogService.record("PRODUCT_CREATE", "PRODUCT", saved.getId(),
                "Tạo sản phẩm: " + saved.getName());
        return productMapper.toAdminDetailDTO(saved, null, List.of());
    }

    @Override
    @Transactional
    public AdminProductDTO update(Long id, ProductUpdateRequest req) {
        Product product = findProductOrThrow(id);

        if (req.name() != null) {
            product.setName(req.name());
            String slug = req.slug() != null ? req.slug() : SlugUtils.toSlug(req.name());
            if (!slug.equals(product.getSlug()) && productRepository.existsBySlug(slug)) {
                throw new AppException(ErrorCode.SLUG_ALREADY_EXISTS);
            }
            product.setSlug(slug);
        }
        if (req.productCode()        != null) product.setProductCode(req.productCode());
        if (req.description()        != null) product.setDescription(req.description());
        if (req.categoryId()         != null) product.setCategory(findCategoryOrThrow(req.categoryId()));
        if (req.priceFrom()          != null) product.setPriceFrom(req.priceFrom());
        if (req.priceTo()            != null) product.setPriceTo(req.priceTo());
        if (req.featherColor()       != null) product.setFeatherColor(req.featherColor());
        if (req.weightGrams()        != null) product.setWeightGrams(req.weightGrams());
        if (req.ageMonths()          != null) product.setAgeMonths(req.ageMonths());
        if (req.vaccinationStatus()  != null) product.setVaccinationStatus(req.vaccinationStatus());
        if (req.characterTraits()    != null) product.setCharacterTraits(req.characterTraits());
        if (req.status()             != null) product.setStatus(req.status());

        List<ProductMedia> media = productMediaRepository
                .findByProductIdOrderByDisplayOrderAsc(id);
        Product saved = productRepository.save(product);
        auditLogService.record("PRODUCT_UPDATE", "PRODUCT", saved.getId(),
                "Cập nhật sản phẩm: " + saved.getName());
        return toAdminDetailDTO(saved, media);
    }

    @Override
    @Transactional
    public AdminProductDTO updateStatus(Long id, ProductStatus status) {
        Product product = findProductOrThrow(id);
        ProductStatus prev = product.getStatus();
        product.setStatus(status);
        List<ProductMedia> media = productMediaRepository
                .findByProductIdOrderByDisplayOrderAsc(id);
        Product saved = productRepository.save(product);
        auditLogService.record("PRODUCT_STATUS_CHANGE", "PRODUCT", saved.getId(),
                "Đổi trạng thái: " + saved.getName() + " " + prev + " → " + status);
        return toAdminDetailDTO(saved, media);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Product product = findProductOrThrow(id);
        String name = product.getName();
        productMediaRepository.findByProductIdOrderByDisplayOrderAsc(id)
                .forEach(m -> cloudinaryService.delete(m.getCloudinaryPublicId()));
        productRepository.delete(product);
        auditLogService.record("PRODUCT_DELETE", "PRODUCT", id, "Xóa sản phẩm: " + name);
    }

    // ── Admin — Media ────────────────────────────────────────────────────────

    @Override
    @Transactional
    public AdminProductMediaDTO uploadMedia(Long productId, MultipartFile file) {
        Product product = findProductOrThrow(productId);
        CloudinaryService.UploadResult result =
                cloudinaryService.upload(file, "gatre/products/" + productId);

        String contentType = file.getContentType() != null ? file.getContentType() : "";
        MediaType mediaType = contentType.startsWith("video") ? MediaType.VIDEO : MediaType.IMAGE;

        boolean isFirstMedia = productMediaRepository.countByProductId(productId) == 0;
        int nextOrder = productMediaRepository.countByProductId(productId);

        ProductMedia media = productMediaRepository.save(ProductMedia.builder()
                .product(product)
                .mediaUrl(result.url())
                .mediaType(mediaType)
                .primary(isFirstMedia)
                .cloudinaryPublicId(result.publicId())
                .displayOrder(nextOrder)
                .build());

        return productMapper.toAdminMediaDTO(media);
    }

    @Override
    @Transactional
    public void setPrimaryMedia(Long productId, Long mediaId) {
        findProductOrThrow(productId);
        ProductMedia media = productMediaRepository.findById(mediaId)
                .filter(m -> m.getProduct().getId().equals(productId))
                .orElseThrow(() -> new AppException(ErrorCode.MEDIA_NOT_FOUND));

        productMediaRepository.clearPrimaryForProduct(productId);
        media.setPrimary(true);
        productMediaRepository.save(media);
    }

    @Override
    @Transactional
    public void deleteMedia(Long productId, Long mediaId) {
        findProductOrThrow(productId);
        ProductMedia media = productMediaRepository.findById(mediaId)
                .filter(m -> m.getProduct().getId().equals(productId))
                .orElseThrow(() -> new AppException(ErrorCode.MEDIA_NOT_FOUND));

        cloudinaryService.delete(media.getCloudinaryPublicId());
        productMediaRepository.delete(media);

        if (media.isPrimary()) {
            productMediaRepository
                    .findByProductIdOrderByDisplayOrderAsc(productId)
                    .stream().findFirst()
                    .ifPresent(next -> {
                        next.setPrimary(true);
                        productMediaRepository.save(next);
                    });
        }
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private AdminProductDTO toAdminDetailDTO(Product product, List<ProductMedia> media) {
        List<AdminProductMediaDTO> mediaDTOs = media.stream()
                .map(productMapper::toAdminMediaDTO)
                .toList();
        return productMapper.toAdminDetailDTO(product, getPrimaryUrl(media), mediaDTOs);
    }

    private String getPrimaryUrl(List<ProductMedia> media) {
        return media.stream().filter(ProductMedia::isPrimary)
                .map(ProductMedia::getMediaUrl).findFirst().orElse(null);
    }

    private Map<Long, String> batchFetchPrimaryUrls(List<Long> productIds) {
        if (productIds.isEmpty()) return Map.of();
        return productMediaRepository.findPrimaryMediaByProductIds(productIds)
                .stream()
                .collect(Collectors.toMap(
                        m -> m.getProduct().getId(),
                        ProductMedia::getMediaUrl));
    }

    private Product findProductOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    private Category findCategoryOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }
}
