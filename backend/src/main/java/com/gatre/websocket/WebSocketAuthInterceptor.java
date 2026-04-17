package com.gatre.websocket;

import com.gatre.security.CustomUserDetailsService;
import com.gatre.security.JwtProvider;
import com.gatre.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtProvider jwtProvider;
    private final CustomUserDetailsService userDetailsService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    Long userId = jwtProvider.getUserIdFromToken(token);
                    UserPrincipal principal =
                            (UserPrincipal) userDetailsService.loadUserById(userId);
                    accessor.setUser(principal);
                } catch (Exception e) {
                    log.warn("WebSocket auth failed: {}", e.getMessage());
                    // Deny the connection by returning null
                    return null;
                }
            }
        }
        return message;
    }
}
