package com.rajesh.sharing.service;

import com.rajesh.sharing.dto.DocumentMemberResponse;
import com.rajesh.sharing.dto.ShareDocumentRequest;

import java.util.List;

public interface DocumentShareService {
    DocumentMemberResponse shareDocument(Long documentId, String currentUserEmail, ShareDocumentRequest request);
    List<DocumentMemberResponse> getMembers(Long documentId, String currentUserEmail);
    DocumentMemberResponse updatedRole (Long documentId, Long userId, String currentUserEmail,ShareDocumentRequest request);
    void removeMember(Long documentId, Long userId,String currentUserEmail);
}