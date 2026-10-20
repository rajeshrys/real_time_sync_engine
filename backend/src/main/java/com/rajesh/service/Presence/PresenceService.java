package com.rajesh.service.Presence;

public interface PresenceService {
    void userConnected(Long userId);
    void userDisconnected(Long userId);
    boolean isOnline(Long userId);
}
