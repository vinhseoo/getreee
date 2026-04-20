package com.gatre.repository;

import com.gatre.entity.Favorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    @Query("SELECT f FROM Favorite f JOIN FETCH f.product WHERE f.userId = :userId")
    Page<Favorite> findPageByUserId(@Param("userId") Long userId, Pageable pageable);

    boolean existsByUserIdAndProductId(Long userId, Long productId);

    long deleteByUserIdAndProductId(Long userId, Long productId);

    @Query("SELECT f.product.id FROM Favorite f WHERE f.userId = :userId AND f.product.id IN :productIds")
    List<Long> findProductIdsByUserIdAndProductIdIn(
            @Param("userId") Long userId,
            @Param("productIds") Collection<Long> productIds);

    long countByUserId(Long userId);
}
