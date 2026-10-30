package com.rajesh.sharing.dto;

import com.rajesh.common.enums.DocumentRole;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShareDocumentRequest {
    private String username;
    private DocumentRole role;
}