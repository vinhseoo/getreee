package com.gatre.repository;

import com.gatre.entity.ProductMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductMediaRepository extends JpaRepository<ProductMedia, Long> {

    List<ProductMedia> findByProductIdOrderByDisplayOrderAsc(Long productId);

    Optional<ProductMedia> findByProductIdAndPrimaryTrue(Long productId);

    /** Batch-fetch primary media for a list of product IDs — avoids N+1 on catalog pages. */
    @Query("SELECT m FROM ProductMedia m WHERE m.product.id IN :productIds AND m.primary = true")
    List<ProductMedia> findPrimaryMediaByProductIds(@Param("productIds") List<Long> productIds);

    /** Unsets the primary flag for all media belonging to a product. */
    @Modifying
    @Query("UPDATE ProductMedia m SET m.primary = false WHERE m.product.id = :productId")
    void clearPrimaryForProduct(@Param("productId") Long productId);

    int countByProductId(Long productId);
}