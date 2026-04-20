package com.gatre.service.impl;

import com.gatre.dto.admin.AdminUserDTO;
import com.gatre.dto.request.AdminCreateUserRequest;
import com.gatre.dto.request.AdminResetPasswordRequest;
import com.gatre.dto.request.AdminUpdateUserRequest;
import com.gatre.dto.request.ChangePasswordRequest;
import com.gatre.dto.request.UpdateProfileRequest;
import com.gatre.dto.response.PageResponse;
import com.gatre.dto.response.UserProfileDTO;
import com.gatre.entity.User;
import com.gatre.entity.enums.AuthProvider;
import com.gatre.exception.AppException;
import com.gatre.exception.ErrorCode;
import com.gatre.mapper.UserMapper;
import com.gatre.repository.UserRepository;
import com.gatre.security.UserPrincipal;
import com.gatre.service.AuditLogService;
import com.gatre.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper     userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    @Override
    @Transactional(readOnly = true)
    public UserProfileDTO getCurrentUser(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toProfileDTO(user);
    }

    @Override
    @Transactional
    public UserProfileDTO updateProfile(UserPrincipal principal, UpdateProfileRequest request) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (request.name() != null) {
            String name = request.name().trim();
            if (name.isEmpty()) throw new AppException(ErrorCode.INVALID_INPUT);
            user.setName(name);
        }
        if (request.avatarUrl() != null) {
            String avatar = request.avatarUrl().trim();
            user.setAvatarUrl(avatar.isEmpty() ? null : avatar);
        }
        return userMapper.toProfileDTO(userRepository.save(user));
    }

    @Override
    @Transactional
    public void changePassword(UserPrincipal principal, ChangePasswordRequest request) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (user.getProvider() != AuthProvider.LOCAL) {
            throw new AppException(ErrorCode.PASSWORD_CHANGE_NOT_SUPPORTED);
        }
        if (request.newPassword() == null || request.newPassword().length() < 6) {
            throw new AppException(ErrorCode.PASSWORD_TOO_SHORT);
        }
        if (user.getPasswordHash() == null
                || request.currentPassword() == null
                || !passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AdminUserDTO> listUsers(String keyword, Pageable pageable) {
        Page<User> page = (keyword != null && !keyword.isBlank())
                ? userRepository.searchByKeyword(keyword.trim(), pageable)
                : userRepository.findAll(pageable);
        return PageResponse.from(page.map(userMapper::toAdminDTO));
    }

    @Override
    @Transactional
    public AdminUserDTO toggleActive(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setActive(!user.isActive());
        User saved = userRepository.save(user);
        auditLogService.record("USER_TOGGLE_ACTIVE", "USER", saved.getId(),
                (saved.isActive() ? "Mở khoá tài khoản: " : "Khoá tài khoản: ") + saved.getEmail());
        return userMapper.toAdminDTO(saved);
    }

    @Override
    @Transactional
    public AdminUserDTO createUser(AdminCreateUserRequest request) {
        if (request.email() == null || request.email().isBlank()
                || request.name() == null || request.name().isBlank()
                || request.role() == null) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }
        if (request.password() == null || request.password().length() < 6) {
            throw new AppException(ErrorCode.PASSWORD_TOO_SHORT);
        }
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User user = User.builder()
                .email(email)
                .name(request.name().trim())
                .role(request.role())
                .provider(AuthProvider.LOCAL)
                .passwordHash(passwordEncoder.encode(request.password()))
                .active(true)
                .build();
        User saved = userRepository.save(user);
        auditLogService.record("USER_CREATE", "USER", saved.getId(),
                "Tạo tài khoản " + saved.getRole() + ": " + saved.getEmail());
        return userMapper.toAdminDTO(saved);
    }

    @Override
    @Transactional
    public AdminUserDTO updateUser(Long userId, AdminUpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (request.name() != null) {
            String name = request.name().trim();
            if (name.isEmpty()) throw new AppException(ErrorCode.INVALID_INPUT);
            user.setName(name);
        }
        if (request.role() != null) user.setRole(request.role());
        if (request.active() != null) user.setActive(request.active());

        User saved = userRepository.save(user);
        auditLogService.record("USER_UPDATE", "USER", saved.getId(),
                "Cập nhật tài khoản: " + saved.getEmail());
        return userMapper.toAdminDTO(saved);
    }

    @Override
    @Transactional
    public void resetPassword(Long userId, AdminResetPasswordRequest request) {
        if (request.newPassword() == null || request.newPassword().length() < 6) {
            throw new AppException(ErrorCode.PASSWORD_TOO_SHORT);
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (user.getProvider() != AuthProvider.LOCAL) {
            throw new AppException(ErrorCode.PASSWORD_CHANGE_NOT_SUPPORTED);
        }
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        auditLogService.record("USER_RESET_PASSWORD", "USER", user.getId(),
                "Đặt lại mật khẩu cho: " + user.getEmail());
    }
}
