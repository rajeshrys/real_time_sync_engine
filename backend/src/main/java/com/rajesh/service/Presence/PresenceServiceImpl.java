package com.rajesh.service.Presence;

import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PresenceServiceImpl implements PresenceService {

    private final ConcurrentHashMap<String, Set<String>> onlineUsers =
            new ConcurrentHashMap<>();



    @Override
    public boolean userConnected(String username, String sessionId) {
        Set<String> sessions = onlineUsers.computeIfAbsent(username, key -> ConcurrentHashMap.newKeySet());
        boolean wasOffline = sessions.isEmpty();
        sessions.add(sessionId);
        return wasOffline;
    }

    @Override
    public boolean userDisconnected(String username, String sessionId) {
        Set<String> sessions = onlineUsers.get(username);
        if (sessions == null) {
            return false;
        }
        sessions.remove(sessionId);
        if (sessions.isEmpty()) {
            onlineUsers.remove(username);
            return true;
        }
        return false;
    }

    @Override
    public boolean isOnline(String username) {
        Set<String> sessions = onlineUsers.get(username);
        return sessions != null && !sessions.isEmpty();
    }

    @Override
    public Set<String> getOnlineUsers() {
        return onlineUsers.keySet();
    }
}
