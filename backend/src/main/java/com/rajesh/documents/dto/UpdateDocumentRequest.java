package com.rajesh.documents.dto;

import lombok.Getter;
import lombok.Setter;
import tools.jackson.databind.JsonNode;

@Getter
@Setter
public class UpdateDocumentRequest {
    private String title;
    private JsonNode content;
}