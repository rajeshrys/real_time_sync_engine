package com.rajesh.connections.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(
        name = "friendships",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"user_id", "friend_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_id", nullable = false)
    private Long userId;
    @Column(name = "friend_id", nullable = false)
    private Long friendId;
    @Column(nullable = false)
    private LocalDateTime createdAt;
    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }
    public Friendship(Long userId, Long friendId) {
        this.userId = userId;
        this.friendId = friendId;
    }
}