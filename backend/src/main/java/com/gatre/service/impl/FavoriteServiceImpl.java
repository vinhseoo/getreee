package com.gatre.service.impl;

import com.gatre.dto.response.PageResponse;
import com.gatre.dto.response.PublicProductDTO;
import com.gatre.entity.Favorite;
import com.gatre.entity.Product;
import com.gatre.entity.ProductMedia;
import com.gatre.exception.AppException;
import com.gatre.exception.ErrorCode;
import com.gatre.mapper.ProductMapper;
import com.gatre.repository.FavoriteRepository;
import com.gatre.repository.ProductMediaRepository;
import com.gatre.repository.ProductRepository;
import com.gatre.security.UserPrincipal;
import com.gatre.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository     favoriteRepository;
    private final ProductRepository      productRepository;
    private final ProductMediaRepository productMediaRepository;
    private final ProductMapper          productMapper;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PublicProductDTO> listForUser(UserPrincipal principal, Pageable pageable) {
        Page<Favorite> page = favoriteRepository.findPageByUserId(principal.getId(), pageable);
        List<Long> productIds = page.getContent().stream()
                .map(f -> f.getProduct().getId())
                .toList();
        Map<Long, String> primaryUrls = productIds.isEmpty()
                ? Map.of()
                : productMediaRepository.findPrimaryMediaByProductIds(productIds).stream()
                    .collect(Collectors.toMap(
                            m -> m.getProduct().getId(),
                            ProductMedia::getMediaUrl,
                            (a, b) -> a));

        return PageResponse.from(page.map(f -> {
            Product p = f.getProduct();
            return productMapper.toPublicListDTO(p, primaryUrls.get(p.getId()));
        }));
    }

    @Override
    @Transactional
    public void add(UserPrincipal principal, Long productId) {
        if (favoriteRepository.existsByUserIdAndProductId(principal.getId(), productId)) return;
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        favoriteRepository.save(Favorite.builder()
                .userId(principal.getId())
                .product(product)
                .build());
    }

    @Override
    @Transactional
    public void remove(UserPrincipal principal, Long productId) {
        favoriteRepository.deleteByUserIdAndProductId(principal.getId(), productId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Long> filterFavoritedIds(UserPrincipal principal, List<Long> productIds) {
        if (productIds == null || productIds.isEmpty()) return List.of();
        return favoriteRepository.findProductIdsByUserIdAndProductIdIn(principal.getId(), productIds);
    }
}
