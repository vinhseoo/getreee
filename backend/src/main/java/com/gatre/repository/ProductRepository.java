package com.gatre.repository;

import com.gatre.entity.Product;
import com.gatre.entity.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>,
        JpaSpecificationExecutor<Product> {

    Optional<Product> findBySlug(String slug);
    boolean existsBySlug(String slug);
    long countByStatus(ProductStatus status);
    long countByCategoryId(Long categoryId);
}