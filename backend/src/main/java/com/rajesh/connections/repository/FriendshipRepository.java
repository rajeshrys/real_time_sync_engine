package com.rajesh.connections.repository;

import com.rajesh.connections.model.Friendship;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FriendshipRepository
        extends JpaRepository<Friendship, Long> {
    List<Friendship> findByUserId(Long userId);
    List<Friendship> findByFriendId(Long friendId);
    Optional<Friendship> findByUserIdAndFriendId(
            Long userId,
            Long friendId
    );
}