package com.gatre.repository;

import com.gatre.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    Page<ChatMessage> findByConversationIdOrderByCreatedAtAsc(Long conversationId, Pageable pageable);

    long countByConversationIdAndReadFalse(Long conversationId);

    @Modifying
    @Query("UPDATE ChatMessage m SET m.read = true WHERE m.conversation.id = :conversationId AND m.read = false")
    void markAllReadByConversationId(Long conversationId);
}