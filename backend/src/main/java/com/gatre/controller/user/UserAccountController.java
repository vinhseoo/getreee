package com.gatre.controller.user;

import com.gatre.dto.request.ChangePasswordRequest;
import com.gatre.dto.request.UpdateProfileRequest;
import com.gatre.dto.response.ApiResponse;
import com.gatre.dto.response.UserProfileDTO;
import com.gatre.exception.AppException;
import com.gatre.exception.ErrorCode;
import com.gatre.security.UserPrincipal;
import com.gatre.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/me")
@RequiredArgsConstructor
public class UserAccountController {

    private final UserService userService;

    @PutMapping
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody UpdateProfileRequest request
    ) {
        if (principal == null) throw new AppException(ErrorCode.UNAUTHORIZED);
        return ResponseEntity.ok(ApiResponse.ok(userService.updateProfile(principal, request)));
    }

    @PostMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody ChangePasswordRequest request
    ) {
        if (principal == null) throw new AppException(ErrorCode.UNAUTHORIZED);
        userService.changePassword(principal, request);
        return ResponseEntity.ok(ApiResponse.ok());
    }
}
