package com.gatre.controller.admin;

import com.gatre.dto.admin.AdminCategoryDTO;
import com.gatre.dto.request.CategoryCreateRequest;
import com.gatre.dto.request.CategoryUpdateRequest;
import com.gatre.dto.response.ApiResponse;
import com.gatre.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminCategoryDTO>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(categoryService.findAllAdmin()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminCategoryDTO>> create(
            @Valid @RequestBody CategoryCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(categoryService.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminCategoryDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(categoryService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok());
    }
}