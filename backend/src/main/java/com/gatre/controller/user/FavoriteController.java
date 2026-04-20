package com.gatre.controller.user;

import com.gatre.dto.response.ApiResponse;
import com.gatre.dto.response.PageResponse;
import com.gatre.dto.response.PublicProductDTO;
import com.gatre.exception.AppException;
import com.gatre.exception.ErrorCode;
import com.gatre.security.UserPrincipal;
import com.gatre.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PublicProductDTO>>> list(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {
        if (principal == null) throw new AppException(ErrorCode.UNAUTHORIZED);
        return ResponseEntity.ok(ApiResponse.ok(favoriteService.listForUser(principal, pageable)));
    }

    @GetMapping("/ids")
    public ResponseEntity<ApiResponse<List<Long>>> filterIds(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam List<Long> productIds) {
        if (principal == null) throw new AppException(ErrorCode.UNAUTHORIZED);
        return ResponseEntity.ok(ApiResponse.ok(
                favoriteService.filterFavoritedIds(principal, productIds)));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> add(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long productId) {
        if (principal == null) throw new AppException(ErrorCode.UNAUTHORIZED);
        favoriteService.add(principal, productId);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> remove(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long productId) {
        if (principal == null) throw new AppException(ErrorCode.UNAUTHORIZED);
        favoriteService.remove(principal, productId);
        return ResponseEntity.ok(ApiResponse.ok());
    }
}
