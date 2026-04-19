package com.gatre.service.impl;

import com.gatre.dto.admin.AdminUserDTO;
import com.gatre.dto.response.PageResponse;
import com.gatre.dto.response.UserProfileDTO;
import com.gatre.entity.User;
import com.gatre.exception.AppException;
import com.gatre.exception.ErrorCode;
import com.gatre.repository.UserRepository;
import com.gatre.security.UserPrincipal;
import com.gatre.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserProfileDTO getCurrentUser(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return new UserProfileDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getRole()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AdminUserDTO> listUsers(Pageable pageable) {
        Page<User> page = userRepository.findAll(pageable);
        return PageResponse.from(page.map(this::toAdminDTO));
    }

    @Override
    @Transactional
    public AdminUserDTO toggleActive(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setActive(!user.isActive());
        return toAdminDTO(userRepository.save(user));
    }

    private AdminUserDTO toAdminDTO(User user) {
        return new AdminUserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getRole(),
                user.getProvider(),
                user.isActive(),
                user.getCreatedAt()
        );
    }
}