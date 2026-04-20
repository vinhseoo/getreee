package com.gatre.controller.admin;

import com.gatre.dto.admin.AdminUserDTO;
import com.gatre.dto.response.ApiResponse;
import com.gatre.dto.response.PageResponse;
import com.gatre.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AdminUserDTO>>> listUsers(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(userService.listUsers(keyword, pageable)));
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<AdminUserDTO>> toggleActive(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(userService.toggleActive(id)));
    }
}
