package com.rajesh.sharing.model;

import com.rajesh.common.enums.DocumentRole;
import com.rajesh.documents.model.Document;
import com.rajesh.users.model.User;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.cglib.core.Local;

@Entity
@Table(
        name = "document_members",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"document_id", "user_id"}
                )
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch= FetchType.LAZY,optional = false)
    @JoinColumn(name="document_id",nullable = false)
    private Document document;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false,length = 20)
    private DocumentRole role;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}