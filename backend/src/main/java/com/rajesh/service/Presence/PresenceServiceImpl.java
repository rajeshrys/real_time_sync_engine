package com.rajesh.service.Presence;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class PresenceServiceImpl implements PresenceService{

    private final Set<Long> onlineUsers = ConcurrentHashMap.newKeySet();

    @Override
    public void userConnected(Long userId) {
        onlineUsers.add(userId);
    }

    @Override
    public void userDisconnected(Long userId) {
        onlineUsers.remove(userId);
    }

    @Override
    public boolean isOnline(Long userId) {
        return onlineUsers.contains(userId);
    }
}
