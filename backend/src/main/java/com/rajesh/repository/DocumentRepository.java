package com.rajesh.repository;

import com.rajesh.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository <Document,Long> {

    List<Document> findByOwnerIdAndDeletedAtIsNull(Long ownerId);

    List<Document> findByOwnerIdAndDeletedAtIsNotNull(Long ownerId);

    Optional<Document> findByIdAndOwnerId(Long id,Long ownerId);

}
