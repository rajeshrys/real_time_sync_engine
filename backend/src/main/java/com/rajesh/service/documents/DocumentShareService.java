package com.rajesh.service.documents;

import com.rajesh.dto.Documents.DocumentMemberResponse;
import com.rajesh.dto.Documents.ShareDocumentRequest;
import com.rajesh.model.User;
import org.hibernate.internal.util.Optional;

import javax.swing.text.html.Option;
import java.util.List;

public interface DocumentShareService {



    DocumentMemberResponse shareDocument(Long documentId, String currentUserEmail, ShareDocumentRequest request);

    List<DocumentMemberResponse> getMembers(Long documentId, String currentUserEmail);

    DocumentMemberResponse updatedRole (Long documentId, Long userId, String currentUserEmail,ShareDocumentRequest request);

    void removeMember(Long documentId, Long userId,String currentUserEmail);

}
