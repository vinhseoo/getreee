package com.gatre.service;

import com.gatre.dto.admin.AdminAuditLogDTO;
import com.gatre.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface AuditLogService {
    /**
     * Record an admin action. Reads the acting principal from SecurityContext.
     * Never throws — audit failure must not break the business flow.
     */
    void record(String action, String entityType, Long entityId, String summary);

    PageResponse<AdminAuditLogDTO> list(String entityType, Pageable pageable);
}
