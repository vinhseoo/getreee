package com.gatre.controller.admin;

import com.gatre.dto.request.PostMessageRequest;
import com.gatre.dto.response.ApiResponse;
import com.gatre.dto.response.ChatMessageDTO;
import com.gatre.dto.response.ConversationDTO;
import com.gatre.dto.response.PageResponse;
import com.gatre.security.UserPrincipal;
import com.gatre.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/chat")
@RequiredArgsConstructor
public class AdminChatController {

    private final ChatService           chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<PageResponse<ConversationDTO>>> listConversations(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(chatService.getAllConversations(pageable)));
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<ApiResponse<PageResponse<ChatMessageDTO>>> getMessages(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 30, sort = "createdAt", direction = Sort.Direction.ASC)
            Pageable pageable) {
        return ResponseEntity.ok(
                ApiResponse.ok(chatService.getMessages(id, principal.getId(), pageable)));
    }

    @PostMapping("/conversations/{id}/messages")
    public ResponseEntity<ApiResponse<ChatMessageDTO>> sendMessage(
            @PathVariable Long id,
            @RequestBody @Valid PostMessageRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        ChatMessageDTO saved = chatService.sendMessage(
                id, principal.getId(), request.content(), request.productId());

        ConversationDTO conv = chatService.getConversationById(id, principal.getId());
        // Deliver to the user in real-time
        messagingTemplate.convertAndSendToUser(
                conv.userId().toString(), "/queue/messages", saved);
        // Echo to admin inbox for multi-tab support
        messagingTemplate.convertAndSend("/topic/admin/inbox", saved);

        return ResponseEntity.ok(ApiResponse.ok(saved));
    }

    @PatchMapping("/conversations/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markRead(@PathVariable Long id) {
        chatService.markConversationRead(id);
        return ResponseEntity.ok(ApiResponse.ok());
    }
}