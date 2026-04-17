package com.gatre.controller.admin;

import com.gatre.dto.response.ApiResponse;
import com.gatre.dto.response.ChatMessageDTO;
import com.gatre.dto.response.ConversationDTO;
import com.gatre.dto.response.PageResponse;
import com.gatre.security.UserPrincipal;
import com.gatre.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/chat")
@RequiredArgsConstructor
public class AdminChatController {

    private final ChatService chatService;

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

    @PatchMapping("/conversations/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markRead(@PathVariable Long id) {
        chatService.markConversationRead(id);
        return ResponseEntity.ok(ApiResponse.ok());
    }
}