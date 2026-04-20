package com.gatre.controller;

import com.gatre.dto.response.ApiResponse;
import com.gatre.dto.response.PageResponse;
import com.gatre.dto.response.PublicCategoryDTO;
import com.gatre.dto.response.PublicProductDTO;
import com.gatre.service.CategoryService;
import com.gatre.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicProductController {

    private final CategoryService categoryService;
    private final ProductService  productService;

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<PublicCategoryDTO>>> categories() {
        return ResponseEntity.ok(ApiResponse.ok(categoryService.findAllPublic()));
    }

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<PageResponse<PublicProductDTO>>> products(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String featherColor,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {
        return ResponseEntity.ok(
                ApiResponse.ok(productService.findPublicProducts(categoryId, featherColor, keyword, pageable)));
    }

    @GetMapping("/products/{slug}")
    public ResponseEntity<ApiResponse<PublicProductDTO>> product(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(productService.findBySlugPublic(slug)));
    }
}