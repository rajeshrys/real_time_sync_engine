package com.rajesh.connections.service;

import com.rajesh.connections.dto.ConnectionMemberResponse;
import com.rajesh.connections.dto.ConnectionRequestResponse;

import java.util.List;

public interface ConnectionService {
    void sendConnectionRequest(String currentUserEmail, Long receiverId);
    List<ConnectionRequestResponse> getPendingRequests(String currentUserEmail);
    void acceptConnectRequest(String currentUserEmail,Long connectionId);
    void rejectConnectionRequest(String currentUserEmail, Long connectionId);
    List<ConnectionMemberResponse> getConnections(String currentUserEmail);
}