package com.rajesh.sharing.repository;

import com.rajesh.documents.model.Document;
import com.rajesh.sharing.model.DocumentMember;
import com.rajesh.users.model.User;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentMemberRepository extends JpaRepository<DocumentMember,Long> {
    Optional<DocumentMember> findByDocumentAndUser(Document document, User user);
    List<DocumentMember> findByDocument(Document document);
    List<DocumentMember> findByUserAndDocument_DeletedAtIsNull(User user);
    void deleteByDocumentAndUser(Document document,User user);
}