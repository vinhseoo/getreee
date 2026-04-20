package com.gatre.mapper;

import com.gatre.dto.response.ChatMessageDTO;
import com.gatre.dto.response.ConversationDTO;
import com.gatre.dto.response.ProductSnapshotDTO;
import com.gatre.entity.ChatMessage;
import com.gatre.entity.Conversation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ChatMapper {

    @Mapping(target = "conversationId",  source = "conversation.id")
    @Mapping(target = "senderId",        source = "sender.id")
    @Mapping(target = "senderName",      source = "sender.name")
    @Mapping(target = "senderAvatarUrl", source = "sender.avatarUrl")
    @Mapping(target = "productSnapshot", ignore = true)
    ChatMessageDTO toMessageDTOWithoutSnapshot(ChatMessage message);

    default ChatMessageDTO toMessageDTO(ChatMessage message, ProductSnapshotDTO productSnapshot) {
        ChatMessageDTO base = toMessageDTOWithoutSnapshot(message);
        return new ChatMessageDTO(
                base.id(), base.conversationId(), base.senderId(), base.senderName(),
                base.senderAvatarUrl(), base.content(), base.read(), productSnapshot, base.createdAt()
        );
    }

    @Mapping(target = "userId",       source = "user.id")
    @Mapping(target = "userName",     source = "user.name")
    @Mapping(target = "userAvatarUrl",source = "user.avatarUrl")
    @Mapping(target = "lastMessage",  ignore = true)
    ConversationDTO toConversationDTOBase(Conversation conversation, long unreadCount);

    default ConversationDTO toConversationDTO(Conversation conversation, long unreadCount, String lastMessage) {
        ConversationDTO base = toConversationDTOBase(conversation, unreadCount);
        return new ConversationDTO(base.id(), base.userId(), base.userName(), base.userAvatarUrl(),
                base.lastMessageAt(), base.unreadCount(), lastMessage);
    }
}
