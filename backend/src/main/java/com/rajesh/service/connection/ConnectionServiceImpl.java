package com.rajesh.service.connection;


import com.rajesh.dto.connections.ConnectionRequestResponse;
import com.rajesh.enums.ConnectionsStatus;
import com.rajesh.model.Connection;
import com.rajesh.model.User;
import com.rajesh.repository.ConnectionRepository;
import com.rajesh.repository.UserRepository;
import com.sun.tools.jconsole.JConsoleContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConnectionServiceImpl implements ConnectionService{
    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;

    @Override
    public void sendConnectionRequest(String currentUserEmail, Long receiverId) {
        User requester = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() ->
                        new RuntimeException("Current user not found")
                );
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(()->
        new RuntimeException("User not found"));

        if(requester.getId().equals(receiver.getId())){
            throw new RuntimeException(
                    "You cannot send a connection request to yourself"
            );
        }

//        check requester -> receiver
        boolean requestExists =
                connectionRepository.findByRequesterAndReceiver(requester,
                                receiver)
                        .isPresent();

//        check receiver -> requester
        boolean reverseRequestExists =
                connectionRepository
                        .findByRequesterAndReceiver(receiver, requester)
                        .isPresent();

        if (requestExists || reverseRequestExists) {
            throw new RuntimeException(
                    "A connection request already exists"
            );
        }
        Connection connection = Connection.builder()
                .requester(requester)
                .receiver(receiver)
                .status(ConnectionsStatus.PENDING)
                .build();
    }

    @Override
    public List<ConnectionRequestResponse> getPendingRequests(String currentUserEmail) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(()->
                        new RuntimeException("current user not found")
                );
        List<Connection> connections = connectionRepository.findByReceiverAndStatus(currentUser,ConnectionsStatus.PENDING);

        return connections.stream()
                .map(connection ->
                {
                    User requester = connection.getRequester();
                    return ConnectionRequestResponse.builder()
                            .connectionId(connection.getId())
                            .userId(requester.getId())
                            .username(requester.getUsername())
                            .firstName(requester.getFirstName())
                            .lastName(requester.getLastName())
                            .email(requester.getEmail())
                            .build();
                })
                .toList();
    }

    @Override
    public void acceptConnectRequest(String currentUserEmail, Long connectionId) {

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() ->
                        new RuntimeException("Current user not found")
                );

        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() ->
                        new RuntimeException("Connection request not found")
                );
        if(!connection.getReceiver().getId().equals(currentUser.getId())){
            throw new RuntimeException(
                    "You are not allowed to accept this request"
            );
        }
        if(connection.getStatus()!=ConnectionsStatus.PENDING){
            throw new RuntimeException(
                    "Connection request is no longer pending"
            );
        }
        connection.setStatus(ConnectionsStatus.ACCEPTED);
        connectionRepository.save(connection);
    }

    @Override
    public void rejectConnectionRequest(
            String currentUserEmail,
            Long connectionId
    ) {

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() ->
                        new RuntimeException("Current user not found")
                );

        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() ->
                        new RuntimeException("Connection request not found")
                );

        if (!connection.getReceiver().getId().equals(currentUser.getId())) {
            throw new RuntimeException(
                    "You are not allowed to reject this request"
            );
        }

        if (connection.getStatus() != ConnectionsStatus.PENDING) {
            throw new RuntimeException(
                    "Connection request is no longer pending"
            );
        }

        connection.setStatus(ConnectionsStatus.REJECTED);

        connectionRepository.save(connection);
    }
}
