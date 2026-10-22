package com.rajesh.service.presence;

import com.rajesh.service.Presence.PresenceService;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PresenceServiceImpl implements PresenceService {

    private final Set<String> onlineUsers =
            ConcurrentHashMap.newKeySet();

    @Override
    public void userConnected(String username) {
        onlineUsers.add(username);
    }

    @Override
    public void userDisconnected(String username) {
        onlineUsers.remove(username);
    }

    @Override
    public boolean isOnline(String username) {
        return onlineUsers.contains(username);
    }
}