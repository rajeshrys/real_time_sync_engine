package com.rajesh.dto.Documents;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateDocumentRequest {
    private String title;
    private String content;
}
