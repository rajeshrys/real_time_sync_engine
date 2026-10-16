package com.rajesh.service.auth;

import com.rajesh.dto.Auth.RegisterRequest;
import com.rajesh.dto.Auth.RegisterResponse;
import com.rajesh.dto.Login.LoginRequest;
import com.rajesh.dto.Login.LoginResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request) throws Exception;

    LoginResponse login(LoginRequest request) throws  Exception;
}
