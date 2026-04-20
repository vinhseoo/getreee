package com.gatre.service;

import com.gatre.dto.response.PageResponse;
import com.gatre.dto.response.PublicProductDTO;
import com.gatre.security.UserPrincipal;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FavoriteService {
    PageResponse<PublicProductDTO> listForUser(UserPrincipal principal, Pageable pageable);
    void add(UserPrincipal principal, Long productId);
    void remove(UserPrincipal principal, Long productId);
    List<Long> filterFavoritedIds(UserPrincipal principal, List<Long> productIds);
}
