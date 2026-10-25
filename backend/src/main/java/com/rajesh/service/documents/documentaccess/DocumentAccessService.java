package com.rajesh.service.documents.documentaccess;

import com.rajesh.enums.DocumentRole;
import com.rajesh.model.Document;
import com.rajesh.model.User;


public interface DocumentAccessService {

    DocumentRole getRole(Document document, User user);

    boolean canRead(Document document,User user);

    boolean canEdit(Document document,User user);

    boolean isOwner(Document document,User user);
}
