package com.rajesh.connections.model;

import com.rajesh.common.enums.ConnectionsStatus;
import com.rajesh.users.model.User;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import jdk.jfr.DataAmount;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Entity
@Table(name = "connections",
uniqueConstraints = {
        @UniqueConstraint(
                columnNames = {"requester_id","receiver_id"}
        )
})
public class Connection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "requester_id" ,nullable = false)
    private User requester;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConnectionsStatus status;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}