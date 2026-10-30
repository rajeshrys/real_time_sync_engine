package com.rajesh.sharing.service;

import com.rajesh.common.enums.DocumentRole;
import com.rajesh.documents.model.Document;
import com.rajesh.sharing.model.DocumentMember;
import com.rajesh.sharing.repository.DocumentMemberRepository;
import com.rajesh.users.model.User;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DocumentAccessServiceImpl implements DocumentAccessService {
    private final DocumentMemberRepository documentMemberRepository;
    @Override
    public DocumentRole getRole(Document document, User user) {
        if(document.getOwnerId().equals(user.getId())){
            return DocumentRole.OWNER;
        }
        return documentMemberRepository.findByDocumentAndUser(document,user)
                .map(DocumentMember::getRole)
                .orElse(null);
    }
    @Override
    public boolean canRead(Document document, User user) {
        DocumentRole role = getRole(document,user);
        return role == DocumentRole.OWNER
                || role == DocumentRole.EDITOR
                || role == DocumentRole.VIEWER;
    }
    @Override
    public boolean canEdit(Document document, User user) {
        DocumentRole role = getRole(document, user);
        return role == DocumentRole.OWNER
                || role == DocumentRole.EDITOR;
    }
    @Override
    public boolean isOwner(Document document, User user) {
        return document.getOwnerId().equals(user.getId());
    }
}