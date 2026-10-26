package com.rajesh.dto.Documents;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SharedDocumentResponse {
    private Long id;
    private String title;
    private String content;
    private Long ownerId;
    private String role;
    private String ownerUsername;
}
