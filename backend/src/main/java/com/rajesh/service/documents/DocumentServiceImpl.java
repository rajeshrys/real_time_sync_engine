package com.rajesh.service.documents;

import com.rajesh.dto.Documents.CreateDocumentRequest;
import com.rajesh.dto.Documents.UpdateDocumentRequest;
import com.rajesh.model.Document;
import com.rajesh.model.DocumentMember;
import com.rajesh.model.User;
import com.rajesh.repository.DocumentMemberRepository;
import com.rajesh.repository.DocumentRepository;
import com.rajesh.repository.UserRepository;
import com.rajesh.service.documents.documentaccess.DocumentAccessService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.json.JsonParseException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService{
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final DocumentAccessService documentAccessService;
    private final DocumentMemberRepository documentMemberRepository;

    public Document createDocument(CreateDocumentRequest request) throws Exception {
        String contentJson;
        //        Get current user email
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        try {
            contentJson = objectMapper.writeValueAsString(request.getContent());
        }catch (JsonParseException e ){
            throw new Exception("failed to convert document content",e);
        }

        // Find user from database
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Document document = Document.builder()
                .title(request.getTitle())
                .content(contentJson)
                .ownerId(user.getId())
                .build();
        return documentRepository.save(document);
    }

    public List<Document> getAllDocuments() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long ownerId = user.getId();
        
        List<Document> ownedDocuments =
                documentRepository.findByOwnerIdAndDeletedAtIsNull(user.getId());

        List<Document> sharedDocuments =
                documentMemberRepository
                        .findByUserAndDocument_DeletedAtIsNull(user)
                        .stream()
                        .map(DocumentMember::getDocument)
                        .toList();

        return Stream.concat(
                        ownedDocuments.stream(),
                        sharedDocuments.stream()
                )
                .distinct()
                .toList();
    }

    public Document getDocumentById(Long id) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User not found"));
        Document document = documentRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Document not found with id:"+id));
        if(!documentAccessService.canRead(document,user)){
            throw new RuntimeException("You do not have access to this document");
        }

        return document;
    }

    @Override
    public Document updateDocument(
            Long id,
            UpdateDocumentRequest request
    ) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Document document = documentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Document not found")
                );

        if (!documentAccessService.canEdit(document, user)) {
            throw new RuntimeException(
                    "You do not have permission to edit this document"
            );
        }

        String contentJson;

        try {
            contentJson =
                    objectMapper.writeValueAsString(request.getContent());

        } catch (JsonParseException e) {
            throw new RuntimeException(
                    "Failed to convert document content",
                    e
            );
        }

        document.setTitle(request.getTitle());
        document.setContent(contentJson);

        return documentRepository.save(document);
    }

    public void deleteDocument(Long id) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long ownerId = user.getId();

        Document document = documentRepository
                .findByIdAndOwnerId(id, ownerId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        document.setDeletedAt(LocalDateTime.now());

        documentRepository.save(document);
    }

    @Override
    public List<Document> getTrashDocuments() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long ownerId = user.getId();

        return documentRepository
                .findByOwnerIdAndDeletedAtIsNotNull(ownerId);
    }

    @Override
    public void restoreDocument(Long id) {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long ownerId = user.getId();

        Document document = documentRepository
                .findByIdAndOwnerId(id, ownerId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (document.getDeletedAt() == null) {
            throw new RuntimeException("Document is not in trash");
        }

        document.setDeletedAt(null);

        documentRepository.save(document);
    }

    @Override
    public void permanentlyDeleteDocument(Long id) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long ownerId = user.getId();

        Document document = documentRepository
                .findByIdAndOwnerId(id, ownerId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (document.getDeletedAt() == null) {
            throw new RuntimeException("Document is not in trash");
        }

        documentRepository.delete(document);
    }

}
