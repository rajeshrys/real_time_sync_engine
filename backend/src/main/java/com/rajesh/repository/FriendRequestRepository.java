package com.rajesh.repository;

import com.rajesh.enums.FriendRequestStatus;
import com.rajesh.model.FriendRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface FriendRequestRepository extends JpaRepository<FriendRequest,Long> {
    Optional<FriendRequest> findBySenderIdAndReceiverId(
            Long SenderId,
            Long receiverId
    );

    List<FriendRequest> findByReceiverIdAndStatus(Long receiverId, FriendRequestStatus status);

}
