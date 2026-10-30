package com.rajesh.sharing.service;

import com.rajesh.common.enums.DocumentRole;
import com.rajesh.documents.model.Document;
import com.rajesh.users.model.User;

public interface DocumentAccessService {
    DocumentRole getRole(Document document, User user);
    boolean canRead(Document document,User user);
    boolean canEdit(Document document,User user);
    boolean isOwner(Document document,User user);
}