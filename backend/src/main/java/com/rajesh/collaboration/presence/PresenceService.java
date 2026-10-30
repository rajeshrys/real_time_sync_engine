package com.rajesh.collaboration.presence;

import com.rajesh.users.model.User;
import com.rajesh.users.repository.UserRepository;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class PresenceService {
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final Map<String, Set<String>> userSessions =
            new ConcurrentHashMap<>();
    public PresenceService(
            SimpMessagingTemplate messagingTemplate,
            UserRepository userRepository
    ) {
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
    }
    // ==========================================
    // CONNECT
    // ==========================================
    public boolean connect(
            String email,
            String sessionId
    ) {
        Set<String> sessions =
                userSessions.computeIfAbsent(
                        email,
                        key -> ConcurrentHashMap.newKeySet()
                );
        boolean wasOffline =
                sessions.isEmpty();
        sessions.add(sessionId);
        System.out.println(
                "User: " + email +
                        " | Sessions: " + sessions.size()
        );
        if (wasOffline) {
            System.out.println(
                    "🟢 " + email + " is ONLINE"
            );
            broadcastPresence(
                    email,
                    "ONLINE"
            );
        }
        return wasOffline;
    }
    // ==========================================
    // DISCONNECT
    // ==========================================
    public boolean disconnect(
            String email,
            String sessionId
    ) {
        Set<String> sessions =
                userSessions.get(email);
        if (sessions == null) {
            return false;
        }
        sessions.remove(sessionId);
        System.out.println(
                "User: " + email +
                        " | Sessions remaining: "
                        + sessions.size()
        );
        if (sessions.isEmpty()) {
            userSessions.remove(email);
            System.out.println(
                    "🔴 " + email + " is OFFLINE"
            );
            broadcastPresence(
                    email,
                    "OFFLINE"
            );
            return true;
        }
        return false;
    }
    // ==========================================
    // ONLINE CHECK
    // ==========================================
    public boolean isOnline(
            String email
    ) {
        Set<String> sessions =
                userSessions.get(email);
        return sessions != null &&
                !sessions.isEmpty();
    }
    // ==========================================
    // BROADCAST
    // ==========================================
    private void broadcastPresence(String email, String status) {
        User user = userRepository.findByEmail(email)
                .orElse(null);
        if (user == null) {
            System.out.println(
                    "❌ Cannot broadcast presence. User not found: " + email
            );
            return;
        }
        Map<String, Object> event = Map.of(
                "userId", user.getId(),
                "email", user.getEmail(),
                "status", status
        );
        System.out.println(
                "📡 Broadcasting presence: " + event
        );
        messagingTemplate.convertAndSend(
                "/topic/presence",
                (Object) event
        );
    }
}