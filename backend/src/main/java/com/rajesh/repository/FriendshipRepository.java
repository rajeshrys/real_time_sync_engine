package com.rajesh.repository;

import com.rajesh.model.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository
        extends JpaRepository<Friendship, Long> {

    List<Friendship> findByUserId(Long userId);

    List<Friendship> findByFriendId(Long friendId);

    Optional<Friendship> findByUserIdAndFriendId(
            Long userId,
            Long friendId
    );
}