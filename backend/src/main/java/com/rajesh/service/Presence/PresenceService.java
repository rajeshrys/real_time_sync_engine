package com.rajesh.service.Presence;

public interface PresenceService {

    void userConnected(String username);

    void userDisconnected(String username);

    boolean isOnline(String username);
}
