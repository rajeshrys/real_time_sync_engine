package com.rajesh.documents.service;

import com.rajesh.documents.dto.CreateDocumentRequest;
import com.rajesh.documents.dto.UpdateDocumentRequest;
import com.rajesh.documents.model.Document;
import com.rajesh.sharing.dto.SharedDocumentResponse;

import java.util.List;
import javax.print.Doc;

public interface DocumentService {
    Document createDocument(CreateDocumentRequest request) throws Exception;
    List<Document> getAllDocuments(String currentUserEmail);
    Document getDocumentById(Long id);
    Document updateDocument(Long id, UpdateDocumentRequest request);
    void deleteDocument(Long id);
    List<Document> getTrashDocuments();
    void restoreDocument(Long id);
    void permanentlyDeleteDocument(Long id);
    List<SharedDocumentResponse> getSharedDocuments(String currentUserEmail);
}