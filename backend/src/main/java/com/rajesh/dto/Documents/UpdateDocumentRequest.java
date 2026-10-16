package com.rajesh.dto.Documents;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateDocumentRequest {
    private String title;
    private String content;
}
