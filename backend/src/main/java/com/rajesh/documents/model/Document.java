package com.rajesh.documents.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "documents")
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String title;
    @Column(columnDefinition = "LONGTEXT")
    private String content;
    @Column(nullable = false)
    private Long ownerId;
//    Soft delete
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    @PrePersist
    protected void onCreate(){
        updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    protected  void onUpdate(){
        updatedAt = LocalDateTime.now();
    }
    private LocalDateTime updatedAt;
}