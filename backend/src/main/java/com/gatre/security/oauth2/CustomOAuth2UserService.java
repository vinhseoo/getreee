package com.gatre.security.oauth2;

import com.gatre.entity.User;
import com.gatre.entity.enums.AuthProvider;
import com.gatre.entity.enums.Role;
import com.gatre.repository.UserRepository;
import com.gatre.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Value("${app.admin.emails:}")
    private String adminEmailsConfig;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email      = oAuth2User.getAttribute("email");
        String name       = oAuth2User.getAttribute("name");
        String avatarUrl  = oAuth2User.getAttribute("picture");
        String providerId = oAuth2User.getAttribute("sub");

        User user = userRepository.findByEmail(email)
                .map(existing -> syncProfile(existing, name, avatarUrl))
                .orElseGet(() -> createUser(email, name, avatarUrl, providerId));

        return UserPrincipal.from(user);
    }

    private User createUser(String email, String name, String avatarUrl, String providerId) {
        return userRepository.save(User.builder()
                .email(email)
                .name(name)
                .avatarUrl(avatarUrl)
                .role(isAdminEmail(email) ? Role.ADMIN : Role.USER)
                .provider(AuthProvider.GOOGLE)
                .providerId(providerId)
                .active(true)
                .build());
    }

    /** Keeps name and avatar in sync with Google on every login. */
    private User syncProfile(User user, String name, String avatarUrl) {
        user.setName(name);
        user.setAvatarUrl(avatarUrl);
        return userRepository.save(user);
    }

    private boolean isAdminEmail(String email) {
        if (adminEmailsConfig == null || adminEmailsConfig.isBlank()) return false;
        List<String> adminEmails = Arrays.stream(adminEmailsConfig.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
        return adminEmails.contains(email);
    }
}