package com.rajesh.service.friends;

import com.rajesh.enums.FriendRequestStatus;
import com.rajesh.model.FriendRequest;
import com.rajesh.model.Friendship;
import com.rajesh.repository.FriendRequestRepository;
import com.rajesh.repository.FriendshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendServiceImpl implements FriendService {

    private final FriendRequestRepository friendRequestRepository;
    private final FriendshipRepository friendshipRepository;

    @Override
    @Transactional
    public FriendRequest sendRequest(
            Long senderId,
            Long receiverId
    ) {

        // Cannot send request to yourself
        if (senderId.equals(receiverId)) {
            throw new RuntimeException(
                    "You cannot send a friend request to yourself"
            );
        }

        // Check if already friends
        boolean alreadyFriends =
                friendshipRepository
                        .findByUserIdAndFriendId(senderId, receiverId)
                        .isPresent()
                        ||
                        friendshipRepository
                                .findByUserIdAndFriendId(receiverId, senderId)
                                .isPresent();

        if (alreadyFriends) {
            throw new RuntimeException(
                    "You are already friends"
            );
        }

        // Check existing request: sender -> receiver
        var existingRequest =
                friendRequestRepository
                        .findBySenderIdAndReceiverId(
                                senderId,
                                receiverId
                        );

        if (existingRequest.isPresent()) {

            FriendRequest request = existingRequest.get();

            if (request.getStatus() == FriendRequestStatus.PENDING) {
                throw new RuntimeException(
                        "Friend request already exists"
                );
            }

            if (request.getStatus() == FriendRequestStatus.ACCEPTED) {
                throw new RuntimeException(
                        "You are already friends"
                );
            }

            // If previously rejected, allow sending again
            if (request.getStatus() == FriendRequestStatus.REJECTED) {
                request.setStatus(FriendRequestStatus.PENDING);
                return friendRequestRepository.save(request);
            }
        }

        // Check reverse request: receiver -> sender
        var reverseRequest =
                friendRequestRepository
                        .findBySenderIdAndReceiverId(
                                receiverId,
                                senderId
                        );

        if (reverseRequest.isPresent()) {

            FriendRequest request = reverseRequest.get();

            if (request.getStatus() == FriendRequestStatus.PENDING) {
                throw new RuntimeException(
                        "This user has already sent you a friend request"
                );
            }
        }

        // Create new request
        FriendRequest request = FriendRequest.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .status(FriendRequestStatus.PENDING)
                .build();

        return friendRequestRepository.save(request);
    }


    @Override
    @Transactional
    public FriendRequest acceptRequest(
            Long requestId,
            Long currentUserId
    ) {

        FriendRequest request =
                friendRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Friend request not found"
                                )
                        );

        // Only receiver can accept
        if (!request.getReceiverId().equals(currentUserId)) {
            throw new RuntimeException(
                    "You cannot accept this request"
            );
        }

        // Request must be pending
        if (request.getStatus() != FriendRequestStatus.PENDING) {
            throw new RuntimeException(
                    "Request is no longer pending"
            );
        }

        Long senderId = request.getSenderId();
        Long receiverId = request.getReceiverId();

        // Create A -> B friendship
        Friendship friendship1 =
                new Friendship(
                        senderId,
                        receiverId
                );

        // Create B -> A friendship
        Friendship friendship2 =
                new Friendship(
                        receiverId,
                        senderId
                );

        friendshipRepository.save(friendship1);
        friendshipRepository.save(friendship2);

        // Mark request as accepted
        request.setStatus(FriendRequestStatus.ACCEPTED);

        return friendRequestRepository.save(request);
    }


    @Override
    @Transactional
    public void rejectRequest(
            Long requestId,
            Long currentUserId
    ) {

        FriendRequest request =
                friendRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Friend request not found"
                                )
                        );

        // Only receiver can reject
        if (!request.getReceiverId().equals(currentUserId)) {
            throw new RuntimeException(
                    "You cannot reject this request"
            );
        }

        // Request must be pending
        if (request.getStatus() != FriendRequestStatus.PENDING) {
            throw new RuntimeException(
                    "Request is no longer pending"
            );
        }

        request.setStatus(FriendRequestStatus.REJECTED);

        friendRequestRepository.save(request);
    }


    @Override
    public List<FriendRequest> getPendingRequests(
            Long userId
    ) {

        return friendRequestRepository
                .findByReceiverIdAndStatus(
                        userId,
                        FriendRequestStatus.PENDING
                );
    }


    @Override
    public List<Friendship> getFriends(
            Long userId
    ) {

        return friendshipRepository
                .findByUserId(userId);
    }
}