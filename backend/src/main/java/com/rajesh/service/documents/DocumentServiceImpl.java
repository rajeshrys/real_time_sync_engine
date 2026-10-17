package com.rajesh.service.documents;

import com.rajesh.dto.Documents.CreateDocumentRequest;
import com.rajesh.dto.Documents.UpdateDocumentRequest;
import com.rajesh.model.Document;
import com.rajesh.model.User;
import com.rajesh.repository.DocumentRepository;
import com.rajesh.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.json.JsonParseException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService{
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

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
        return documentRepository.findAll();
    }

    public Document getDocumentById(Long id) {

        return documentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Document not found with id: " + id)
                );
    }

    public Document updateDocument(
            Long id,
            UpdateDocumentRequest request
    ) {
        String contentJson;
        try {
            contentJson = objectMapper.writeValueAsString(request.getContent());
        }catch (JsonParseException e ){
            try {
                throw new Exception("failed to convert document content",e);
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
        }

        Document document = getDocumentById(id);

        document.setTitle(request.getTitle());
        document.setContent(contentJson);

        return documentRepository.save(document);
    }

    public void deleteDocument(Long id) {

        Document document = getDocumentById(id);

        documentRepository.delete(document);
    }

}
