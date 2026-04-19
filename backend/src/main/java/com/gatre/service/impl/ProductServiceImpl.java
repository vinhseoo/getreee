package com.gatre.service.impl;

import com.gatre.dto.admin.AdminProductDTO;
import com.gatre.dto.admin.AdminProductMediaDTO;
import com.gatre.dto.request.ProductCreateRequest;
import com.gatre.dto.request.ProductUpdateRequest;
import com.gatre.dto.response.PageResponse;
import com.gatre.dto.response.ProductMediaDTO;
import com.gatre.dto.response.PublicCategoryDTO;
import com.gatre.dto.response.PublicProductDTO;
import com.gatre.entity.Category;
import com.gatre.entity.Product;
import com.gatre.entity.ProductMedia;
import com.gatre.entity.User;
import com.gatre.entity.enums.MediaType;
import com.gatre.entity.enums.ProductStatus;
import com.gatre.exception.AppException;
import com.gatre.exception.ErrorCode;
import com.gatre.repository.CategoryRepository;
import com.gatre.repository.ProductMediaRepository;
import com.gatre.repository.ProductRepository;
import com.gatre.repository.UserRepository;
import com.gatre.repository.spec.ProductSpecification;
import com.gatre.security.UserPrincipal;
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
                toPublicListDTO(p, primaryUrls.get(p.getId()))));
    }

    @Override
    @Transactional(readOnly = true)
    public PublicProductDTO findBySlugPublic(String slug) {
        Product product = productRepository.findBySlug(slug)
                .filter(p -> p.getStatus() == ProductStatus.AVAILABLE)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        List<ProductMedia> media = productMediaRepository
                .findByProductIdOrderByDisplayOrderAsc(product.getId());

        return toPublicDetailDTO(product, media);
    }

    // ── Admin — Products ─────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AdminProductDTO> findAllAdmin(Pageable pageable) {
        Page<Product> page = productRepository.findAll(pageable);
        Map<Long, String> primaryUrls = batchFetchPrimaryUrls(
                page.getContent().stream().map(Product::getId).toList());
        return PageResponse.from(page.map(p ->
                toAdminListDTO(p, primaryUrls.get(p.getId()))));
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
                .description(req.description())
                .category(category)
                .createdBy(creator)
                .priceFrom(req.priceFrom())
                .priceTo(req.priceTo())
                .featherColor(req.featherColor())
                .weightGrams(req.weightGrams())
                .ageMonths(req.ageMonths())
                .status(req.status() != null ? req.status() : ProductStatus.AVAILABLE)
                .build());

        return toAdminDetailDTO(saved, List.of());
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
        if (req.description()  != null) product.setDescription(req.description());
        if (req.categoryId()   != null) product.setCategory(findCategoryOrThrow(req.categoryId()));
        if (req.priceFrom()    != null) product.setPriceFrom(req.priceFrom());
        if (req.priceTo()      != null) product.setPriceTo(req.priceTo());
        if (req.featherColor() != null) product.setFeatherColor(req.featherColor());
        if (req.weightGrams()  != null) product.setWeightGrams(req.weightGrams());
        if (req.ageMonths()    != null) product.setAgeMonths(req.ageMonths());
        if (req.status()       != null) product.setStatus(req.status());

        List<ProductMedia> media = productMediaRepository
                .findByProductIdOrderByDisplayOrderAsc(id);
        return toAdminDetailDTO(productRepository.save(product), media);
    }

    @Override
    @Transactional
    public AdminProductDTO updateStatus(Long id, ProductStatus status) {
        Product product = findProductOrThrow(id);
        product.setStatus(status);
        List<ProductMedia> media = productMediaRepository
                .findByProductIdOrderByDisplayOrderAsc(id);
        return toAdminDetailDTO(productRepository.save(product), media);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Product product = findProductOrThrow(id);
        // Delete each media file from Cloudinary before removing DB records
        productMediaRepository.findByProductIdOrderByDisplayOrderAsc(id)
                .forEach(m -> cloudinaryService.delete(m.getCloudinaryPublicId()));
        productRepository.delete(product);  // DB cascade removes product_media rows
    }

    // ── Admin — Media ────────────────────────────────────────────────────────

    @Override
    @Transactional
    public AdminProductMediaDTO uploadMedia(Long productId, MultipartFile file) {
        Product product = findProductOrThrow(productId);
        CloudinaryService.UploadResult result =
                cloudinaryService.upload(file, "gatre/products/" + productId);

        // Determine media type from content type
        String contentType = file.getContentType() != null ? file.getContentType() : "";
        MediaType mediaType = contentType.startsWith("video") ? MediaType.VIDEO : MediaType.IMAGE;

        boolean isFirstMedia = productMediaRepository.countByProductId(productId) == 0;
        int nextOrder = productMediaRepository.countByProductId(productId);

        ProductMedia media = productMediaRepository.save(ProductMedia.builder()
                .product(product)
                .mediaUrl(result.url())
                .mediaType(mediaType)
                .primary(isFirstMedia)     // first upload is auto-set as primary
                .cloudinaryPublicId(result.publicId())
                .displayOrder(nextOrder)
                .build());

        return toAdminMediaDTO(media);
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

        // If deleted media was primary, promote the next one
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

    // ── Mapping helpers ──────────────────────────────────────────────────────

    /** List-view: no full media list, just primary URL. Price-stripped. */
    private PublicProductDTO toPublicListDTO(Product p, String primaryUrl) {
        return new PublicProductDTO(
                p.getId(), p.getName(), p.getSlug(), p.getDescription(),
                p.getFeatherColor(), p.getWeightGrams(), p.getAgeMonths(),
                p.getStatus().name(), toCategoryDTO(p.getCategory()),
                primaryUrl, null);
    }

    /** Detail-view: full media list included. Price-stripped. */
    private PublicProductDTO toPublicDetailDTO(Product p, List<ProductMedia> media) {
        String primaryUrl = media.stream().filter(ProductMedia::isPrimary)
                .map(ProductMedia::getMediaUrl).findFirst().orElse(null);
        return new PublicProductDTO(
                p.getId(), p.getName(), p.getSlug(), p.getDescription(),
                p.getFeatherColor(), p.getWeightGrams(), p.getAgeMonths(),
                p.getStatus().name(), toCategoryDTO(p.getCategory()),
                primaryUrl,
                media.stream().map(this::toPublicMediaDTO).toList());
    }

    /** Admin list-view: includes prices, no full media list. */
    private AdminProductDTO toAdminListDTO(Product p, String primaryUrl) {
        return new AdminProductDTO(
                p.getId(), p.getName(), p.getSlug(), p.getDescription(),
                p.getPriceFrom(), p.getPriceTo(),
                p.getFeatherColor(), p.getWeightGrams(), p.getAgeMonths(),
                p.getStatus().name(), toCategoryDTO(p.getCategory()),
                primaryUrl, null,
                p.getCreatedAt(), p.getUpdatedAt());
    }

    /** Admin detail-view: includes prices + full media list. */
    private AdminProductDTO toAdminDetailDTO(Product p, List<ProductMedia> media) {
        String primaryUrl = media.stream().filter(ProductMedia::isPrimary)
                .map(ProductMedia::getMediaUrl).findFirst().orElse(null);
        return new AdminProductDTO(
                p.getId(), p.getName(), p.getSlug(), p.getDescription(),
                p.getPriceFrom(), p.getPriceTo(),
                p.getFeatherColor(), p.getWeightGrams(), p.getAgeMonths(),
                p.getStatus().name(), toCategoryDTO(p.getCategory()),
                primaryUrl,
                media.stream().map(this::toAdminMediaDTO).toList(),
                p.getCreatedAt(), p.getUpdatedAt());
    }

    private PublicCategoryDTO toCategoryDTO(Category c) {
        if (c == null) return null;
        return new PublicCategoryDTO(c.getId(), c.getName(), c.getSlug());
    }

    private ProductMediaDTO toPublicMediaDTO(ProductMedia m) {
        return new ProductMediaDTO(m.getId(), m.getMediaUrl(),
                m.getMediaType().name(), m.isPrimary(), m.getDisplayOrder());
    }

    private AdminProductMediaDTO toAdminMediaDTO(ProductMedia m) {
        return new AdminProductMediaDTO(m.getId(), m.getMediaUrl(),
                m.getMediaType().name(), m.isPrimary(),
                m.getCloudinaryPublicId(), m.getDisplayOrder());
    }

    /** Single batch query to get primary media URLs for a page of products. */
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