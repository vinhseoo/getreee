package com.gatre.websocket;

import com.gatre.dto.request.SendMessageRequest;
import com.gatre.dto.response.ChatMessageDTO;
import com.gatre.dto.response.ConversationDTO;
import com.gatre.exception.AppException;
import com.gatre.security.UserPrincipal;
import com.gatre.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatMessageHandler {

    private final ChatService            chatService;
    private final SimpMessagingTemplate  messagingTemplate;

    @MessageMapping("/chat.send")
    public void handleSend(SendMessageRequest request, Principal principal) {
        UserPrincipal up = (UserPrincipal) principal;

        ChatMessageDTO saved;
        try {
            saved = chatService.sendMessage(
                    request.conversationId(), up.getId(),
                    request.content(), request.productId());
        } catch (AppException e) {
            log.warn("ChatMessageHandler rejected message from user {}: {}", up.getId(), e.getMessage());
            return;
        }

        // Get the conversation owner to route the message to the right user
        ConversationDTO conv = chatService.getConversationById(
                request.conversationId(), up.getId());

        // Deliver to the conversation owner's private queue
        messagingTemplate.convertAndSendToUser(
                conv.userId().toString(), "/queue/messages", saved);

        // Notify admin inbox about every new message (including admin's own sends for multi-tab)
        messagingTemplate.convertAndSend("/topic/admin/inbox", saved);
    }
}