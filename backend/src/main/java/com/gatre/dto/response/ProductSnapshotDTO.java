package com.gatre.dto.response;

/**
 * Minimal product card embedded inside chat message bubbles (Phase 4).
 * Price-stripped by design — same rules as PublicProductDTO.
 */
public record ProductSnapshotDTO(
        Long id,
        String productCode,
        String name,
        String slug,
        String primaryMediaUrl
) {}