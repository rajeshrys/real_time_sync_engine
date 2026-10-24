package com.rajesh.config;

import com.rajesh.service.PresenceService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;

@Component
public class WebSocketPresenceListener {

    private final PresenceService presenceService;

    public WebSocketPresenceListener(PresenceService presenceService) {
        this.presenceService = presenceService;
    }

    @EventListener
    public void handleWebSocketConnect(SessionConnectedEvent event) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(event.getMessage());

        Principal principal = accessor.getUser();

        System.out.println("=================================");
        System.out.println("🔥 WebSocket CONNECTED");
        System.out.println("Session ID: " + accessor.getSessionId());
        System.out.println("Principal: " + principal);
        System.out.println("=================================");

        if (principal == null) {
            System.out.println("❌ No authenticated WebSocket user");
            return;
        }

        String email = principal.getName();
        String sessionId = accessor.getSessionId();

        presenceService.connect(email, sessionId);
    }

    @EventListener
    public void handleWebSocketDisconnect(SessionDisconnectEvent event) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(event.getMessage());

        Principal principal = accessor.getUser();

        System.out.println("=================================");
        System.out.println("🔥 WebSocket DISCONNECTED");
        System.out.println("Session ID: " + accessor.getSessionId());
        System.out.println("Principal: " + principal);
        System.out.println("=================================");

        if (principal == null) {
            System.out.println("❌ No authenticated WebSocket user");
            return;
        }

        String email = principal.getName();
        String sessionId = accessor.getSessionId();

        presenceService.disconnect(email, sessionId);
    }
}