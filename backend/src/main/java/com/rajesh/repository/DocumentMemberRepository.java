package com.rajesh.repository;

import com.rajesh.model.Document;
import com.rajesh.model.DocumentMember;
import com.rajesh.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface DocumentMemberRepository extends JpaRepository<DocumentMember,Long> {

    Optional<DocumentMember> findByDocumentAndUser(Document document, User user);

    List<DocumentMember> findByDocument(Document document);

    List<DocumentMember> findByUserAndDocument_DeletedAtIsNull(User user);

    void deleteByDocumentAndUser(Document document,User user);
}
