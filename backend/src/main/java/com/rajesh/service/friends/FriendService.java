package com.rajesh.service.friends;

import com.rajesh.model.FriendRequest;
import com.rajesh.model.Friendship;

import java.util.List;

public interface FriendService {
    FriendRequest sendRequest(Long senderId ,Long receiverId);

    FriendRequest acceptRequest(Long requestId, Long currentUserId);

    void rejectRequest(Long requestId,Long currentUserId);

    List<FriendRequest> getPendingRequests(Long userId);

    List<Friendship> getFriends(Long userId);
}
