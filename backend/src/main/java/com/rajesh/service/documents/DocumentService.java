package com.rajesh.service.documents;

import com.rajesh.dto.Documents.CreateDocumentRequest;
import com.rajesh.dto.Documents.UpdateDocumentRequest;
import com.rajesh.model.Document;

import java.util.List;

public interface DocumentService {

    Document createDocument(CreateDocumentRequest request);

    List<Document> getAllDocuments();

    Document getDocumentById(Long id);

    Document updateDocument(Long id, UpdateDocumentRequest request);

    void deleteDocument(Long id);
}
