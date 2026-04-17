package com.gatre.service;

import com.gatre.dto.response.UserProfileDTO;
import com.gatre.security.UserPrincipal;

public interface UserService {
    UserProfileDTO getCurrentUser(UserPrincipal principal);
}