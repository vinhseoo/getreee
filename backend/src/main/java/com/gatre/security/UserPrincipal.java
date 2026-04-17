package com.gatre.security;

import com.gatre.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.security.Principal;
import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * Unified principal that satisfies both the JWT filter (UserDetails)
 * and the OAuth2 success handler (OAuth2User).
 * Also implements java.security.Principal so it can be set on WebSocket sessions.
 */
public class UserPrincipal implements UserDetails, OAuth2User, Principal {

    private final Long id;
    private final String email;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean active;
    private Map<String, Object> attributes = Map.of();

    private UserPrincipal(Long id, String email,
                          Collection<? extends GrantedAuthority> authorities,
                          boolean active) {
        this.id = id;
        this.email = email;
        this.authorities = authorities;
        this.active = active;
    }

    public static UserPrincipal from(User user) {
        return new UserPrincipal(
                user.getId(),
                user.getEmail(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())),
                user.isActive()
        );
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }

    // ── UserDetails ──────────────────────────────────────────────────────────
    @Override public String getUsername()              { return email; }
    @Override public String getPassword()              { return null; }
    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override public boolean isAccountNonExpired()     { return true; }
    @Override public boolean isAccountNonLocked()      { return active; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled()               { return active; }

    // ── OAuth2User ───────────────────────────────────────────────────────────
    @Override public Map<String, Object> getAttributes() { return attributes; }
    @Override public String getName()                    { return String.valueOf(id); }
}