package com.rajesh.identity.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginResponse {
    private String message;
    private String accessToken;
    private String token;

    public LoginResponse(String message, String token) {
        this.message = message;
        this.accessToken = token;
        this.token = token;
    }
}
