package com.rajesh.dto.Auth.register;

import com.rajesh.dto.Auth.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class RegisterResponse {
    private String message;
    private UserResponse user;
}
