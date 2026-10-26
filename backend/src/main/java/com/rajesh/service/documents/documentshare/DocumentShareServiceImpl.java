package com.rajesh.service.documents.documentshare;

import com.rajesh.dto.Documents.DocumentMemberResponse;
import com.rajesh.dto.Documents.ShareDocumentRequest;
import com.rajesh.enums.DocumentRole;
import com.rajesh.model.Document;
import com.rajesh.model.DocumentMember;
import com.rajesh.model.User;
import com.rajesh.repository.DocumentMemberRepository;
import com.rajesh.repository.DocumentRepository;
import com.rajesh.repository.UserRepository;
import com.rajesh.service.documents.documentaccess.DocumentAccessService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentShareServiceImpl implements DocumentShareService {

    private final DocumentRepository documentRepository;
    private final DocumentMemberRepository documentMemberRepository;
    private final UserRepository userRepository;
    private final DocumentAccessService documentAccessService;

    @Override
    public DocumentMemberResponse shareDocument(
            Long documentId,
            String currentUserEmail,
            ShareDocumentRequest request
    ) {

        // 1. Get the currently logged-in user
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() ->
                        new RuntimeException("Current user not found")
                );

        // 2. Get the document
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() ->
                        new RuntimeException("Document not found")
                );

        // 3. Validate username
        if (request.getUsername() == null ||
                request.getUsername().trim().isEmpty()) {

            throw new RuntimeException("Username is required");
        }

        // 4. Validate role
        if (request.getRole() == null) {

            throw new RuntimeException("Document role is required");
        }

        // 5. Only the document owner can share the document
        if (!document.getOwnerId().equals(currentUser.getId())) {

            throw new RuntimeException(
                    "Only the document owner can share this document"
            );
        }

        // 6. Find the user using username
        User userToShare = userRepository.findByUsername(
                request.getUsername().trim()
        ).orElseThrow(() ->
                new RuntimeException("User to share with not found")
        );

        // 7. Don't allow sharing with the owner
        if (document.getOwnerId().equals(userToShare.getId())) {

            throw new RuntimeException(
                    "The document owner already has full access"
            );
        }

        // 8. Don't allow OWNER role through sharing
        if (request.getRole() == DocumentRole.OWNER) {

            throw new RuntimeException(
                    "OWNER role cannot be assigned through document sharing"
            );
        }

        // 9. Check whether the user already has access
        if (documentMemberRepository
                .findByDocumentAndUser(document, userToShare)
                .isPresent()) {

            throw new RuntimeException(
                    "User already has access to this document"
            );
        }

        // 10. Create document membership
        DocumentMember member = DocumentMember.builder()
                .document(document)
                .user(userToShare)
                .role(request.getRole())
                .build();

        // 11. Save
        DocumentMember savedMember =
                documentMemberRepository.save(member);

        // 12. Convert entity to response DTO
        return toResponse(savedMember);
    }

    private DocumentMemberResponse toResponse(DocumentMember member) {
        User user = member.getUser();
        return DocumentMemberResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(member.getRole())
                .build();
    }


    @Override
    public List<DocumentMemberResponse> getMembers(Long documentId, String currentUserEmail) {
        // 1. Find current user
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() ->
                        new RuntimeException("Current user not found")
                );

        // 2. Find document
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() ->
                        new RuntimeException("Document not found")
                );

        // 3. User must have access to see members
        if (!documentAccessService.canRead(document, currentUser)) {
            throw new RuntimeException(
                    "You do not have access to this document"
            );
        }
        return documentMemberRepository.findByDocument(document)
                .stream()
                .map(this::toResponse)
        .toList();

    }

    @Override
    public DocumentMemberResponse updatedRole(Long documentId, Long userId, String currentUserEmail, ShareDocumentRequest request) {
        // 1. Find current user
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() ->
                        new RuntimeException("Current user not found")
                );

        // 2. Find document
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() ->
                        new RuntimeException("Document not found")
                );

        // 3. Only owner can change roles
        if (!documentAccessService.isOwner(document, currentUser)) {
            throw new RuntimeException(
                    "Only the document owner can change member roles"
            );
        }

        // 4. Validate role
        if (request.getRole() == null) {
            throw new RuntimeException("Document role is required");
        }

        if (request.getRole() == DocumentRole.OWNER) {
            throw new RuntimeException(
                    "OWNER role cannot be assigned here"
            );
        }

        // 5. Find user
        User memberUser = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        // 6. Find membership
        DocumentMember member =
                documentMemberRepository
                        .findByDocumentAndUser(document, memberUser)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User is not a member of this document"
                                )
                        );

        // 7. Update role
        member.setRole(request.getRole());

        DocumentMember updatedMember =
                documentMemberRepository.save(member);

        return toResponse(updatedMember);
    }

    @Override
    public void removeMember(Long documentId, Long userId, String currentUserEmail) {
    // 1. Find current user
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() ->
                        new RuntimeException("Current user not found")
                );

        // 2. Find document
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() ->
                        new RuntimeException("Document not found")
                );

        // 3. Only owner can remove members
        if (!documentAccessService.isOwner(document, currentUser)) {
            throw new RuntimeException(
                    "Only the document owner can remove members"
            );
        }

        // 4. Find user
        User memberUser = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        if(!documentMemberRepository
                .findByDocumentAndUser(document,memberUser)
                .isPresent()){
            throw new RuntimeException("User is not a member of this document");
        }
        documentMemberRepository.deleteByDocumentAndUser(
                document,
                memberUser
        );

    }
}
