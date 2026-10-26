package com.rajesh.controller;


import com.rajesh.dto.Documents.CreateDocumentRequest;
import com.rajesh.dto.Documents.SharedDocumentResponse;
import com.rajesh.dto.Documents.UpdateDocumentRequest;
import com.rajesh.model.Document;
import com.rajesh.service.documents.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;

    @PostMapping("/new")
    public ResponseEntity<Document> createDocument(
            @RequestBody CreateDocumentRequest request
    ) throws Exception {

        return ResponseEntity.ok(
                documentService.createDocument(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<Document>> getAllDocuments(Authentication authentication) {
        String currentUserEmail = authentication.getName();
        return ResponseEntity.ok(
                documentService.getAllDocuments(currentUserEmail)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocument(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                documentService.getDocumentById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Document> updateDocument(
            @PathVariable Long id,
            @RequestBody UpdateDocumentRequest request
    ) {

        return ResponseEntity.ok(
                documentService.updateDocument(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable Long id
    ) {

        documentService.deleteDocument(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/trash")
    public ResponseEntity<List<Document>> trashDocuments(){
        return ResponseEntity.ok(
                documentService.getTrashDocuments()
        );
    }

    @PostMapping("/{id}/restore")
    public ResponseEntity<Void> restoreDocument(@PathVariable Long id){
        documentService.restoreDocument(id);
        return  ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> permanentlyDeleteDocument(
            @PathVariable Long id
    ) {

        documentService.permanentlyDeleteDocument(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/shared-with-me")
    public ResponseEntity<List<SharedDocumentResponse>> getSharedDocuments (Authentication authentication){
        String currentUserEmail = authentication.getName();
        List<SharedDocumentResponse> documents = documentService.getSharedDocuments(currentUserEmail);
        return ResponseEntity.ok(documents);
    }

}
