package com.gatre.controller.user;

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
@RequestMapping("/api/user/chat")
@RequiredArgsConstructor
public class ChatRestController {

    private final ChatService chatService;

    @GetMapping("/conversation")
    public ResponseEntity<ApiResponse<ConversationDTO>> getOrCreateConversation(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(
                ApiResponse.ok(chatService.getOrCreateConversation(principal.getId())));
    }

    @GetMapping("/conversation/{id}/messages")
    public ResponseEntity<ApiResponse<PageResponse<ChatMessageDTO>>> getMessages(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 30, sort = "createdAt", direction = Sort.Direction.ASC)
            Pageable pageable) {
        return ResponseEntity.ok(
                ApiResponse.ok(chatService.getMessages(id, principal.getId(), pageable)));
    }
}