package com.rajesh.identity.service;

import com.rajesh.identity.dto.AuthTokens;
import com.rajesh.identity.dto.LoginRequest;
import com.rajesh.identity.dto.RegisterRequest;
import com.rajesh.identity.dto.RegisterResponse;

public interface AuthService {
    RegisterResponse register(RegisterRequest request) throws Exception;
    AuthTokens login(LoginRequest request) throws Exception;
    AuthTokens refreshToken(String refreshToken) throws Exception;
    void logout(String refreshToken);
}
