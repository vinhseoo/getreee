package com.gatre.controller;

import com.gatre.dto.request.LoginRequest;
import com.gatre.dto.response.ApiResponse;
import com.gatre.dto.response.AuthResponseDTO;
import com.gatre.dto.response.UserProfileDTO;
import com.gatre.entity.User;
import com.gatre.entity.enums.AuthProvider;
import com.gatre.exception.AppException;
import com.gatre.exception.ErrorCode;
import com.gatre.repository.UserRepository;
import com.gatre.security.CustomUserDetailsService;
import com.gatre.security.JwtProvider;
import com.gatre.security.UserPrincipal;
import com.gatre.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService               userService;
    private final JwtProvider               jwtProvider;
    private final CustomUserDetailsService  userDetailsService;
    private final UserRepository            userRepository;
    private final PasswordEncoder           passwordEncoder;

    /**
     * Email + password login for LOCAL provider accounts.
     * Returns access token in body; refresh token is set as HttpOnly cookie.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        if (request.email() == null || request.password() == null) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        User user = userRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS));

        if (user.getProvider() != AuthProvider.LOCAL) {
            throw new AppException(ErrorCode.LOGIN_NOT_SUPPORTED);
        }

        if (user.getPasswordHash() == null
                || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        if (!user.isActive()) {
            throw new AppException(ErrorCode.USER_INACTIVE);
        }

        String role         = user.getRole().name();
        String accessToken  = jwtProvider.generateAccessToken(user.getId(), user.getEmail(), role);
        String refreshToken = jwtProvider.generateRefreshToken(user.getId(), user.getEmail(), role);

        Cookie refreshCookie = new Cookie("refresh_token", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false);   // TODO: true in production (HTTPS)
        refreshCookie.setPath("/api/auth/refresh");
        refreshCookie.setMaxAge((int) (jwtProvider.getRefreshTokenExpirationMs() / 1000));
        response.addCookie(refreshCookie);

        return ResponseEntity.ok(ApiResponse.ok(
                new AuthResponseDTO(accessToken, jwtProvider.getAccessTokenExpirationMs() / 1000)
        ));
    }

    /**
     * Returns the authenticated user's profile.
     * Frontend calls this after receiving the access token from the OAuth2 callback.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDTO>> me(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (principal == null) throw new AppException(ErrorCode.UNAUTHORIZED);
        return ResponseEntity.ok(ApiResponse.ok(userService.getCurrentUser(principal)));
    }

    /**
     * Issues a new access token using the refresh token stored in the HttpOnly cookie.
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> refresh(
            HttpServletRequest request
    ) {
        String refreshToken = extractRefreshCookie(request);
        if (refreshToken == null) throw new AppException(ErrorCode.REFRESH_TOKEN_MISSING);

        Long userId = jwtProvider.getUserIdFromToken(refreshToken);
        UserPrincipal principal = (UserPrincipal) userDetailsService.loadUserById(userId);
        String role = principal.getAuthorities().iterator().next()
                .getAuthority().replace("ROLE_", "");

        String newAccessToken = jwtProvider.generateAccessToken(
                userId, principal.getEmail(), role);

        return ResponseEntity.ok(ApiResponse.ok(
                new AuthResponseDTO(newAccessToken, jwtProvider.getAccessTokenExpirationMs() / 1000)
        ));
    }

    /**
     * Clears the refresh token cookie, effectively logging the user out on the server side.
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        Cookie expiredCookie = new Cookie("refresh_token", "");
        expiredCookie.setHttpOnly(true);
        expiredCookie.setPath("/api/auth/refresh");
        expiredCookie.setMaxAge(0);
        response.addCookie(expiredCookie);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    private String extractRefreshCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> "refresh_token".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
