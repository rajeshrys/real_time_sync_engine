package com.rajesh.dto.Documents;

import com.rajesh.enums.DocumentRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DocumentMemberResponse {
    private Long userId;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private DocumentRole role;
}
