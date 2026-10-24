package com.rajesh.config;

import com.rajesh.service.PresenceService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketPresenceListener {

    private final PresenceService presenceService;

    private final Map<String, String> sessionUsers =
            new ConcurrentHashMap<>();

    public WebSocketPresenceListener(PresenceService presenceService) {
        this.presenceService = presenceService;
    }

    @EventListener
    public void handleWebSocketConnect(SessionConnectedEvent event) {

        System.out.println();
        System.out.println("========== CONNECT EVENT ==========");

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(event.getMessage());

        String sessionId = accessor.getSessionId();
        Principal principal = accessor.getUser();

        System.out.println("Session ID : " + sessionId);
        System.out.println("Principal  : " + principal);

        if (principal == null) {
            System.out.println("❌ CONNECT: Principal is NULL");
            System.out.println("==================================");
            return;
        }

        if (sessionId == null) {
            System.out.println("❌ CONNECT: Session ID is NULL");
            System.out.println("==================================");
            return;
        }

        String email = principal.getName();

        sessionUsers.put(sessionId, email);

        System.out.println("👤 User     : " + email);
        System.out.println("💾 Stored   : " + sessionId + " -> " + email);

        presenceService.connect(email, sessionId);

        System.out.println("📦 Session map: " + sessionUsers);
        System.out.println("==================================");
        System.out.println();
    }

    @EventListener
    public void handleWebSocketDisconnect(SessionDisconnectEvent event) {

        System.out.println();
        System.out.println("========== DISCONNECT EVENT ==========");

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(event.getMessage());

        String sessionId = accessor.getSessionId();
        Principal principal = accessor.getUser();

        System.out.println("Session ID : " + sessionId);
        System.out.println("Principal  : " + principal);
        System.out.println("Session map BEFORE remove: " + sessionUsers);

        if (sessionId == null) {
            System.out.println("❌ DISCONNECT: Session ID is NULL");
            System.out.println("======================================");
            return;
        }

        String email = sessionUsers.remove(sessionId);

        System.out.println("Lookup result: " + email);

        if (email == null) {
            System.out.println(
                    "❌ No user mapped to session: " + sessionId
            );
            System.out.println(
                    "Session map AFTER remove: " + sessionUsers
            );
            System.out.println("======================================");
            return;
        }

        System.out.println("👤 Disconnected user: " + email);

        presenceService.disconnect(
                email,
                sessionId
        );

        System.out.println(
                "Session map AFTER remove: " + sessionUsers
        );

        System.out.println("======================================");
        System.out.println();
    }
}