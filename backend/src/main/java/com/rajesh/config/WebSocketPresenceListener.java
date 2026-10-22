package com.rajesh.config;

import com.rajesh.service.Presence.PresenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
public class WebSocketPresenceListener {

    private final PresenceService presenceService;

    @EventListener
    public void handleWebSocketConnect(
            SessionConnectedEvent event
    ) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(event.getMessage());

        if (accessor.getUser() != null) {

            String username =
                    accessor.getUser().getName();

            presenceService.userConnected(username);
        }
    }

    @EventListener
    public void handleWebSocketDisconnect(
            SessionDisconnectEvent event
    ) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(event.getMessage());

        if (accessor.getUser() != null) {

            String username =
                    accessor.getUser().getName();

            presenceService.userDisconnected(username);
        }
    }
}