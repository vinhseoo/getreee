package com.gatre.repository;

import com.gatre.entity.User;
import com.gatre.entity.enums.AuthProvider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByProviderAndProviderId(AuthProvider provider, String providerId);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :kw, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :kw, '%'))")
    Page<User> searchByKeyword(@Param("kw") String keyword, Pageable pageable);
}