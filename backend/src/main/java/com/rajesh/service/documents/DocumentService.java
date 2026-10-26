package com.rajesh.service.documents;

import com.rajesh.dto.Documents.CreateDocumentRequest;
import com.rajesh.dto.Documents.SharedDocumentResponse;
import com.rajesh.dto.Documents.UpdateDocumentRequest;
import com.rajesh.model.Document;

import javax.print.Doc;
import java.util.List;

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
