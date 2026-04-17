package com.gatre.controller.admin;

import com.gatre.dto.admin.AdminProductDTO;
import com.gatre.dto.admin.AdminProductMediaDTO;
import com.gatre.dto.request.ProductCreateRequest;
import com.gatre.dto.request.ProductUpdateRequest;
import com.gatre.dto.response.ApiResponse;
import com.gatre.dto.response.PageResponse;
import com.gatre.entity.enums.ProductStatus;
import com.gatre.security.UserPrincipal;
import com.gatre.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AdminProductDTO>>> list(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(productService.findAllAdmin(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminProductDTO>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(productService.findByIdAdmin(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminProductDTO>> create(
            @Valid @RequestBody ProductCreateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(productService.create(request, principal)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminProductDTO>> update(
            @PathVariable Long id,
            @RequestBody ProductUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(productService.update(id, request)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AdminProductDTO>> updateStatus(
            @PathVariable Long id,
            @RequestParam ProductStatus status) {
        return ResponseEntity.ok(ApiResponse.ok(productService.updateStatus(id, status)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // ── Media endpoints ──────────────────────────────────────────────────────

    @PostMapping(value = "/{id}/media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<AdminProductMediaDTO>> uploadMedia(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(productService.uploadMedia(id, file)));
    }

    @PatchMapping("/{id}/media/{mediaId}/primary")
    public ResponseEntity<ApiResponse<Void>> setPrimary(
            @PathVariable Long id,
            @PathVariable Long mediaId) {
        productService.setPrimaryMedia(id, mediaId);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    @DeleteMapping("/{id}/media/{mediaId}")
    public ResponseEntity<ApiResponse<Void>> deleteMedia(
            @PathVariable Long id,
            @PathVariable Long mediaId) {
        productService.deleteMedia(id, mediaId);
        return ResponseEntity.ok(ApiResponse.ok());
    }
}