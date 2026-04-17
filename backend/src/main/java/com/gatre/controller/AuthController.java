package com.gatre.controller;

import com.gatre.dto.response.ApiResponse;
import com.gatre.dto.response.AuthResponseDTO;
import com.gatre.dto.response.UserProfileDTO;
import com.gatre.exception.AppException;
import com.gatre.exception.ErrorCode;
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
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService               userService;
    private final JwtProvider               jwtProvider;
    private final CustomUserDetailsService  userDetailsService;

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
