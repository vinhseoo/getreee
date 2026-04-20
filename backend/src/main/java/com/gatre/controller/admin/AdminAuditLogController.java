package com.gatre.controller.admin;

import com.gatre.dto.admin.AdminAuditLogDTO;
import com.gatre.dto.response.ApiResponse;
import com.gatre.dto.response.PageResponse;
import com.gatre.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/audit-logs")
@RequiredArgsConstructor
public class AdminAuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AdminAuditLogDTO>>> list(
            @RequestParam(required = false) String entityType,
            @PageableDefault(size = 30, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(auditLogService.list(entityType, pageable)));
    }
}
