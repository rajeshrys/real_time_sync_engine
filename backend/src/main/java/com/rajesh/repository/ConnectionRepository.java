package com.rajesh.repository;

import com.rajesh.enums.ConnectionsStatus;
import com.rajesh.model.Connection;
import com.rajesh.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection,Long> {

    Optional<Connection> findByRequesterAndReceiver(User requester, User receiver);


    List<Connection> findByReceiverAndStatus(User receiver, ConnectionsStatus status);

    List<Connection> findByRequesterAndStatus(User requester, ConnectionsStatus status);


    @Query("""
    SELECT c
    FROM Connection c
    WHERE
        (c.requester = :user OR c.receiver = :user)
        AND c.status = :status
""")
    List<Connection> findConnections(
            @Param("user") User user,
            @Param("status") ConnectionsStatus status
    );
}
