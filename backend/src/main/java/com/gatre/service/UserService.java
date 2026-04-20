package com.gatre.service;

import com.gatre.dto.admin.AdminUserDTO;
import com.gatre.dto.request.AdminCreateUserRequest;
import com.gatre.dto.request.AdminResetPasswordRequest;
import com.gatre.dto.request.AdminUpdateUserRequest;
import com.gatre.dto.request.ChangePasswordRequest;
import com.gatre.dto.request.UpdateProfileRequest;
import com.gatre.dto.response.PageResponse;
import com.gatre.dto.response.UserProfileDTO;
import com.gatre.security.UserPrincipal;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserProfileDTO getCurrentUser(UserPrincipal principal);
    UserProfileDTO updateProfile(UserPrincipal principal, UpdateProfileRequest request);
    void changePassword(UserPrincipal principal, ChangePasswordRequest request);
    PageResponse<AdminUserDTO> listUsers(String keyword, Pageable pageable);
    AdminUserDTO toggleActive(Long userId);
    AdminUserDTO createUser(AdminCreateUserRequest request);
    AdminUserDTO updateUser(Long userId, AdminUpdateUserRequest request);
    void resetPassword(Long userId, AdminResetPasswordRequest request);
}