package com.rajesh.dto.Documents;

import com.rajesh.enums.DocumentRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShareDocumentRequest {
    private Long userId;
    private DocumentRole role;
}
