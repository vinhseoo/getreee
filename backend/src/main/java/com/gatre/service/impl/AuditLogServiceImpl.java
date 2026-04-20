package com.gatre.service.impl;

import com.gatre.dto.admin.AdminAuditLogDTO;
import com.gatre.dto.response.PageResponse;
import com.gatre.entity.AuditLog;
import com.gatre.entity.User;
import com.gatre.repository.AuditLogRepository;
import com.gatre.repository.UserRepository;
import com.gatre.security.UserPrincipal;
import com.gatre.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository     userRepository;

    @Override
    @Transactional
    public void record(String action, String entityType, Long entityId, String summary) {
        try {
            AuditLog entry = AuditLog.builder()
                    .actorId(resolveActorId())
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .summary(summary)
                    .build();
            auditLogRepository.save(entry);
        } catch (Exception e) {
            log.warn("Audit log write failed: {} {} {}", action, entityType, entityId, e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AdminAuditLogDTO> list(String entityType, Pageable pageable) {
        Page<AuditLog> page = (entityType != null && !entityType.isBlank())
                ? auditLogRepository.findByEntityType(entityType.trim().toUpperCase(), pageable)
                : auditLogRepository.findAll(pageable);

        // Batch-fetch actor display info to avoid N+1
        var actorIds = page.getContent().stream()
                .map(AuditLog::getActorId)
                .filter(id -> id != null)
                .collect(Collectors.toSet());
        Map<Long, User> actors = actorIds.isEmpty()
                ? Map.of()
                : userRepository.findAllById(actorIds).stream()
                    .collect(Collectors.toMap(User::getId, u -> u));

        return PageResponse.from(page.map(l -> {
            User actor = l.getActorId() != null ? actors.get(l.getActorId()) : null;
            return new AdminAuditLogDTO(
                    l.getId(),
                    l.getActorId(),
                    actor != null ? actor.getName() : null,
                    actor != null ? actor.getEmail() : null,
                    l.getAction(),
                    l.getEntityType(),
                    l.getEntityId(),
                    l.getSummary(),
                    l.getCreatedAt()
            );
        }));
    }

    private Long resolveActorId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return null;
        Object principal = auth.getPrincipal();
        return principal instanceof UserPrincipal up ? up.getId() : null;
    }
}
