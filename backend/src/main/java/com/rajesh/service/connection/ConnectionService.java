package com.rajesh.service.connection;

import com.rajesh.dto.connections.ConnectionRequestResponse;

import java.util.List;

public interface ConnectionService {

    void sendConnectionRequest(String currentUserEmail, Long receiverId);

    List<ConnectionRequestResponse> getPendingRequests(String currentUserEmail);

    void acceptConnectRequest(String currentUserEmail,Long connectionId);

    void rejectConnectionRequest(String currentUserEmail, Long connectionId);

}
