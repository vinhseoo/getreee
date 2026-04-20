package com.gatre.repository.spec;

import com.gatre.entity.Product;
import com.gatre.entity.enums.ProductStatus;
import org.springframework.data.jpa.domain.Specification;

public final class ProductSpecification {

    private ProductSpecification() {}

    public static Specification<Product> hasStatus(ProductStatus status) {
        return (root, query, cb) ->
                status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Product> hasCategoryId(Long categoryId) {
        return (root, query, cb) ->
                categoryId == null ? null : cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Product> hasFeatherColor(String featherColor) {
        return (root, query, cb) ->
                featherColor == null ? null :
                cb.equal(cb.lower(root.get("featherColor")), featherColor.toLowerCase());
    }

    public static Specification<Product> hasKeyword(String keyword) {
        return (root, query, cb) ->
                keyword == null || keyword.isBlank() ? null :
                cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase().trim() + "%");
    }
}