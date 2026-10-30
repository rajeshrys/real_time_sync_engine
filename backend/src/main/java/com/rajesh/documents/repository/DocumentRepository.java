package com.rajesh.documents.repository;

import com.rajesh.documents.model.Document;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository <Document,Long> {
    List<Document> findByOwnerIdAndDeletedAtIsNull(Long ownerId);
    List<Document> findByOwnerIdAndDeletedAtIsNotNull(Long ownerId);
    Optional<Document> findByIdAndOwnerId(Long id,Long ownerId);
}