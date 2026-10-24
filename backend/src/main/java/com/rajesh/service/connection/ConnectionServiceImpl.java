package com.rajesh.service.connection;


import com.rajesh.dto.connections.ConnectionMemberResponse;
import com.rajesh.dto.connections.ConnectionRequestResponse;
import com.rajesh.enums.ConnectionsStatus;
import com.rajesh.model.Connection;
import com.rajesh.model.User;
import com.rajesh.repository.ConnectionRepository;
import com.rajesh.repository.UserRepository;
import com.rajesh.service.PresenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConnectionServiceImpl implements ConnectionService{
    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;
    private final PresenceService presenceService;

    @Override
    public void sendConnectionRequest(String currentUserEmail, Long receiverId) {
        User requester = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() ->
                        new RuntimeException("Current user not found")
                );
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (requester.getId().equals(receiver.getId())) {
            throw new RuntimeException(
                    "You cannot send a connection request to yourself"
            );
        }

        Optional<Connection> outgoingOptional =
                connectionRepository.findByRequesterAndReceiver(
                        requester,
                        receiver
                );


        // 3. Check receiver -> requester relationship


        Optional<Connection> incomingOptional =
                connectionRepository.findByRequesterAndReceiver(
                        receiver,
                        requester
                );

        // 4. Already connected

        if (outgoingOptional.isPresent()
                && outgoingOptional.get().getStatus()
                == ConnectionsStatus.ACCEPTED) {

            throw new RuntimeException(
                    "You are already connected with this user"
            );
        }

        if (incomingOptional.isPresent()
                && incomingOptional.get().getStatus()
                == ConnectionsStatus.ACCEPTED) {

            throw new RuntimeException(
                    "You are already connected with this user"
            );
        }

//        incoming pending request

        if (incomingOptional.isPresent() && incomingOptional.get().getStatus() == ConnectionsStatus.PENDING) {
            throw new RuntimeException("This user has already sent you a connection request");
        }

//        outgoing rejected
        if (outgoingOptional.isPresent() && outgoingOptional.get().getStatus() == ConnectionsStatus.PENDING) {
            throw new RuntimeException("Connection requests already sent");
        }

//       previous outgoing  request got rejected
        if (outgoingOptional.isPresent() && outgoingOptional.get().getStatus() == ConnectionsStatus.REJECTED) {
            Connection connection = outgoingOptional.get();
            connection.setStatus(ConnectionsStatus.PENDING);
            connection.setUpdatedAt(LocalDateTime.now());
            connectionRepository.save(connection);
            return;
        }

//        previous incoming request got rejected
        if (incomingOptional.isPresent() && incomingOptional.get().getStatus() == ConnectionsStatus.REJECTED) {
            Connection connection = new Connection();
            connection.setRequester(requester);
            connection.setReceiver(receiver);
            connection.setCreatedAt(LocalDateTime.now());
            connection.setUpdatedAt(LocalDateTime.now());
            connectionRepository.save(connection);
            return;
        }
        Connection connection = new Connection();

        connection.setRequester(requester);
        connection.setReceiver(receiver);
        connection.setStatus(ConnectionsStatus.PENDING);
        connection.setCreatedAt(LocalDateTime.now());
        connection.setUpdatedAt(LocalDateTime.now());

        connectionRepository.save(connection);
    }

    @Override
    public List<ConnectionRequestResponse> getPendingRequests(String currentUserEmail) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(()->
                        new RuntimeException("current user not found")
                );
        List<Connection> connections = connectionRepository.findByReceiverAndStatus(currentUser,ConnectionsStatus.PENDING);
        System.out.print(connections);

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

//    Gets the Connection memebers
    @Override
    public List<ConnectionMemberResponse> getConnections(String currentUserEmail) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(()->new RuntimeException("current user not found"));

        List<Connection > connections = connectionRepository.findConnections(currentUser,ConnectionsStatus.ACCEPTED);
        return connections.stream()
                .map(connection -> {
                    User otherUser;
                    if(connection.getRequester().getId().equals(currentUser.getId())){
                        otherUser = connection.getReceiver();
                    }else {
                        otherUser = connection.getRequester();
                    }
                    return ConnectionMemberResponse.builder()
                            .id(otherUser.getId())
                            .username(otherUser.getUsername())
                            .firstName(otherUser.getFirstName())
                            .lastName(otherUser.getLastName())
                            .email(otherUser.getEmail())
                            .active(
                                    presenceService.isOnline(otherUser.getEmail())
                            )
                            .build();
                }).toList();
    }
}
