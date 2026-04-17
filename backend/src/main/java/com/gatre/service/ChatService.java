package com.gatre.service;

import com.gatre.dto.response.ChatMessageDTO;
import com.gatre.dto.response.ConversationDTO;
import com.gatre.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface ChatService {

    ConversationDTO getOrCreateConversation(Long userId);

    ConversationDTO getConversationById(Long conversationId, Long requesterId);

    ChatMessageDTO sendMessage(Long conversationId, Long senderId, String content, Long productId);

    PageResponse<ChatMessageDTO> getMessages(Long conversationId, Long requesterId, Pageable pageable);

    PageResponse<ConversationDTO> getAllConversations(Pageable pageable);

    void markConversationRead(Long conversationId);
}