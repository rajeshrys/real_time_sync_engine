package com.rajesh.service.Presence;

import java.util.Set;

public interface PresenceService {

    boolean userConnected(String username ,String sessionId);

    boolean userDisconnected(String username ,String sessionId);

    boolean isOnline(String username);

    Set<String> getOnlineUsers();
}
