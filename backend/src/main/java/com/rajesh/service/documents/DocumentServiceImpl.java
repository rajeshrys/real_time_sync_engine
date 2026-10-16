package com.rajesh.service.documents;

import com.rajesh.dto.Documents.CreateDocumentRequest;
import com.rajesh.dto.Documents.UpdateDocumentRequest;
import com.rajesh.model.Document;
import com.rajesh.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService{
    private final DocumentRepository documentRepository;

    public Document createDocument(CreateDocumentRequest request){
        Document document = Document.builder()
                .title(request.getTitle())
                .content(request.getContent())
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

        Document document = getDocumentById(id);

        document.setTitle(request.getTitle());
        document.setContent(request.getContent());

        return documentRepository.save(document);
    }

    public void deleteDocument(Long id) {

        Document document = getDocumentById(id);

        documentRepository.delete(document);
    }

}
