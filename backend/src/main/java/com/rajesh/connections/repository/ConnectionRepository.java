package com.rajesh.connections.repository;

import com.rajesh.common.enums.ConnectionsStatus;
import com.rajesh.connections.model.Connection;
import com.rajesh.users.model.User;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
    @Query("""
        SELECT c
        FROM Connection c
        WHERE c.status = :status
        AND (
            c.requester = :user
            OR c.receiver = :user
        )
    """)
    List<Connection> findAndAcceptConnections(@Param("User") User user,@Param("Status") ConnectionsStatus status);
    @Query("""
        SELECT c
        FROM Connection c
        WHERE c.status = com.rajesh.common.enums.ConnectionsStatus.ACCEPTED
        AND (
            (c.requester = :userA AND c.receiver = :userB)
            OR
            (c.requester = :userB AND c.receiver = :userA)
        )
    """)
    Optional<Connection> findAcceptedConnection(
            @Param("userA") User userA,
            @Param("userB") User userB
    );
}