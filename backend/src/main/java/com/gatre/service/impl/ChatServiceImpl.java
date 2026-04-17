package com.gatre.service.impl;

import com.gatre.dto.response.ChatMessageDTO;
import com.gatre.dto.response.ConversationDTO;
import com.gatre.dto.response.PageResponse;
import com.gatre.dto.response.ProductSnapshotDTO;
import com.gatre.entity.ChatMessage;
import com.gatre.entity.Conversation;
import com.gatre.entity.Product;
import com.gatre.entity.User;
import com.gatre.entity.enums.Role;
import com.gatre.exception.AppException;
import com.gatre.exception.ErrorCode;
import com.gatre.repository.*;
import com.gatre.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ConversationRepository  conversationRepository;
    private final ChatMessageRepository   chatMessageRepository;
    private final UserRepository          userRepository;
    private final ProductRepository       productRepository;
    private final ProductMediaRepository  productMediaRepository;

    @Override
    @Transactional
    public ConversationDTO getOrCreateConversation(Long userId) {
        Conversation conv = conversationRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
                    return conversationRepository.save(
                            Conversation.builder().user(user).build());
                });
        return toConversationDTO(conv);
    }

    @Override
    @Transactional(readOnly = true)
    public ConversationDTO getConversationById(Long conversationId, Long requesterId) {
        Conversation conv = findConversationOrThrow(conversationId);
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (requester.getRole() != Role.ADMIN
                && !conv.getUser().getId().equals(requesterId)) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        return toConversationDTO(conv);
    }

    @Override
    @Transactional
    public ChatMessageDTO sendMessage(Long conversationId, Long senderId,
                                      String content, Long productId) {
        Conversation conv = findConversationOrThrow(conversationId);
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (sender.getRole() != Role.ADMIN
                && !conv.getUser().getId().equals(senderId)) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        Product product = null;
        if (productId != null) {
            product = productRepository.findById(productId).orElse(null);
        }

        ChatMessage saved = chatMessageRepository.save(ChatMessage.builder()
                .conversation(conv)
                .sender(sender)
                .product(product)
                .content(content)
                .read(false)
                .build());

        conv.setLastMessageAt(Instant.now());
        conversationRepository.save(conv);

        return toChatMessageDTO(saved, buildSnapshot(product));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ChatMessageDTO> getMessages(Long conversationId, Long requesterId,
                                                    Pageable pageable) {
        Conversation conv = findConversationOrThrow(conversationId);
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (requester.getRole() != Role.ADMIN
                && !conv.getUser().getId().equals(requesterId)) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        Page<ChatMessageDTO> page = chatMessageRepository
                .findByConversationIdOrderByCreatedAtAsc(conversationId, pageable)
                .map(m -> toChatMessageDTO(m, buildSnapshot(m.getProduct())));

        return PageResponse.from(page);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ConversationDTO> getAllConversations(Pageable pageable) {
        Page<ConversationDTO> page = conversationRepository
                .findAllByOrderByLastMessageAtDescCreatedAtDesc(pageable)
                .map(this::toConversationDTO);
        return PageResponse.from(page);
    }

    @Override
    @Transactional
    public void markConversationRead(Long conversationId) {
        findConversationOrThrow(conversationId);
        chatMessageRepository.markAllReadByConversationId(conversationId);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Conversation findConversationOrThrow(Long id) {
        return conversationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));
    }

    private ProductSnapshotDTO buildSnapshot(Product product) {
        if (product == null) return null;
        String primaryUrl = productMediaRepository
                .findByProductIdOrderByDisplayOrderAsc(product.getId())
                .stream()
                .filter(m -> m.isPrimary())
                .map(m -> m.getMediaUrl())
                .findFirst()
                .orElse(null);
        return new ProductSnapshotDTO(
                product.getId(), product.getName(), product.getSlug(), primaryUrl);
    }

    private ConversationDTO toConversationDTO(Conversation c) {
        long unread = chatMessageRepository.countByConversationIdAndReadFalse(c.getId());
        return new ConversationDTO(
                c.getId(),
                c.getUser().getId(),
                c.getUser().getName(),
                c.getUser().getAvatarUrl(),
                c.getLastMessageAt(),
                unread);
    }

    private ChatMessageDTO toChatMessageDTO(ChatMessage m, ProductSnapshotDTO snapshot) {
        return new ChatMessageDTO(
                m.getId(),
                m.getConversation().getId(),
                m.getSender().getId(),
                m.getSender().getName(),
                m.getSender().getAvatarUrl(),
                m.getContent(),
                m.isRead(),
                snapshot,
                m.getCreatedAt());
    }
}
