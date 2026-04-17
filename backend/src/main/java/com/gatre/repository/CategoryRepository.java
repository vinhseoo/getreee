package com.gatre.repository;

import com.gatre.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findBySlug(String slug);
    boolean existsBySlug(String slug);

    @Query("SELECT COUNT(p) > 0 FROM Product p WHERE p.category.id = :id")
    boolean hasProducts(@Param("id") Long id);
}