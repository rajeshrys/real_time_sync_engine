package com.rajesh.dto.Auth.Login;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String message;
    private String token;

}
