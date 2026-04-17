package com.gatre.repository;

import com.gatre.entity.Conversation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByUserId(Long userId);

    Page<Conversation> findAllByOrderByLastMessageAtDescCreatedAtDesc(Pageable pageable);
}