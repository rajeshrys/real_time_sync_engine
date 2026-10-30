package com.rajesh.sharing.controller;

import com.rajesh.sharing.dto.DocumentMemberResponse;
import com.rajesh.sharing.dto.ShareDocumentRequest;
import com.rajesh.sharing.service.DocumentShareService;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/documents/share")
@RequiredArgsConstructor
public class DocumentShareController {
    private final DocumentShareService documentShareService;
    @PostMapping("/{documentId}/members")
    public ResponseEntity<DocumentMemberResponse> shareDocument(@PathVariable
                                                                Long documentId,
                                                                @RequestBody ShareDocumentRequest request,
                                                                Authentication authentication){
        String currentUserEmail = authentication.getName();
        DocumentMemberResponse response= documentShareService.shareDocument(
                documentId,
                currentUserEmail,
                request
        );
        return ResponseEntity.ok(response);
    }
    @GetMapping("/{documentId}/members")
    public ResponseEntity<List<DocumentMemberResponse>> getMembers(
            @PathVariable Long documentId,
            Authentication authentication
    ) {
        String currentUserEmail = authentication.getName();
        return ResponseEntity.ok(
                documentShareService.getMembers(
                        documentId,
                        currentUserEmail
                )
        );
    }
    @PutMapping("/{documentId}/members/{userId}")
    public ResponseEntity<DocumentMemberResponse> updateMemberRole(
            @PathVariable Long documentId,
            @PathVariable Long userId,
            @RequestBody ShareDocumentRequest request,
            Authentication authentication
    ){
        String currentUserEmail = authentication.getName();
        return ResponseEntity.ok(
                documentShareService.updatedRole(
                        documentId,
                        userId,
                        currentUserEmail,
                        request
                )
        );
    }
    @DeleteMapping("/{documentId}/members/{userId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable Long documentId,
            @PathVariable Long userId,
            Authentication authentication
    ) {
        String currentUserEmail = authentication.getName();
        documentShareService.removeMember(
                documentId,
                userId,
                currentUserEmail
        );
        return ResponseEntity.noContent().build();
    }
}