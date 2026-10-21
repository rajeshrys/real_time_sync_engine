package com.rajesh.repository;

import com.rajesh.enums.ConnectionsStatus;
import com.rajesh.model.Connection;
import com.rajesh.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection,Long> {

    Optional<Connection> findByRequesterAndReceiver(User requester, User receiver);


    List<Connection> findByReceiverAndStatus(User receiver, ConnectionsStatus status);

    List<Connection> findByRequesterAndStatus(User requester, ConnectionsStatus status);

}
