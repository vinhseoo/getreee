package com.gatre.service;

import com.gatre.dto.admin.AdminUserDTO;
import com.gatre.dto.response.PageResponse;
import com.gatre.dto.response.UserProfileDTO;
import com.gatre.security.UserPrincipal;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserProfileDTO getCurrentUser(UserPrincipal principal);
    PageResponse<AdminUserDTO> listUsers(String keyword, Pageable pageable);
    AdminUserDTO toggleActive(Long userId);
}