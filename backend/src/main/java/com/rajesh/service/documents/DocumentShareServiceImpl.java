package com.rajesh.service.documents;

import com.rajesh.dto.Documents.DocumentMemberResponse;
import com.rajesh.dto.Documents.ShareDocumentRequest;

import java.util.List;

public class DocumentShareServiceImpl implements DocumentShareService{
    @Override
    public DocumentMemberResponse shareDocument(Long documentId, String currentUserEmail, ShareDocumentRequest request) {
        return null;
    }

    @Override
    public List<DocumentMemberResponse> getMembers(Long documentId, String currentUserEmail) {
        return List.of();
    }

    @Override
    public DocumentMemberResponse updatedRole(Long documentId, Long userId, String currentUserEmail, ShareDocumentRequest request) {
        return null;
    }

    @Override
    public void removeMember(Long documentId, Long userId, String currentUserEmail) {

    }
}
