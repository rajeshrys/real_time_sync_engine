package com.rajesh.connections.controller;

import com.rajesh.connections.dto.ConnectionMemberResponse;
import com.rajesh.connections.dto.ConnectionRequestResponse;
import com.rajesh.connections.service.ConnectionService;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/connections")
@RequiredArgsConstructor
public class ConnectionController {
    private final ConnectionService connectionService;
    @PostMapping("/request/{userId}")
    public ResponseEntity<String> sendConnectionRequest(@PathVariable Long userId, Authentication authentication){
        String currentUserEmail = authentication.getName();
        connectionService.sendConnectionRequest(currentUserEmail,userId);
        return ResponseEntity.ok("connection request sent successfully");
    }
    @GetMapping("/requests")
    public ResponseEntity<List<ConnectionRequestResponse>> getPendingRequests(Authentication authentication){
        String currentUserEmail = authentication.getName();
        return ResponseEntity.ok(connectionService.getPendingRequests(currentUserEmail));
    }
    @PutMapping("/{connectionId}/accept")
    public ResponseEntity<String> acceptConnectionRequest(
            @PathVariable Long connectionId,
            Authentication authentication
    ) {
        connectionService.acceptConnectRequest(
                authentication.getName(),
                connectionId
        );
        return ResponseEntity.ok(
                "Connection request accepted"
        );
    }
    @PutMapping("/{connectionId}/reject")
    public ResponseEntity<String> rejectConnectionRequest(
            @PathVariable Long connectionId,
            Authentication authentication
    ) {
        connectionService.rejectConnectionRequest(
                authentication.getName(),
                connectionId
        );
        return ResponseEntity.ok(
                "Connection request rejected"
        );
    }
    @GetMapping
    public ResponseEntity<List<ConnectionMemberResponse>> getConnections(Authentication authentication){
        return ResponseEntity.ok(connectionService.getConnections(authentication.getName()));
    }
}