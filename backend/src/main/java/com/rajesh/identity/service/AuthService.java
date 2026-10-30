package com.rajesh.identity.service;

import com.rajesh.identity.dto.LoginRequest;
import com.rajesh.identity.dto.LoginResponse;
import com.rajesh.identity.dto.RegisterRequest;
import com.rajesh.identity.dto.RegisterResponse;

public interface AuthService {
    RegisterResponse register(RegisterRequest request) throws Exception;
    LoginResponse login(LoginRequest request) throws  Exception;
}