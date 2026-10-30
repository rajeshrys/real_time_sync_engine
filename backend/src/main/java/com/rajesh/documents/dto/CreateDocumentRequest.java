package com.rajesh.documents.dto;

import lombok.Getter;
import lombok.Setter;
import tools.jackson.databind.JsonNode;

@Getter
@Setter
public class CreateDocumentRequest {
    private String title;
    private JsonNode content;
}