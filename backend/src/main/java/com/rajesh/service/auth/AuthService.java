package com.rajesh.service.auth;

import com.rajesh.dto.Auth.register.RegisterRequest;
import com.rajesh.dto.Auth.register.RegisterResponse;
import com.rajesh.dto.Auth.Login.LoginRequest;
import com.rajesh.dto.Auth.Login.LoginResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request) throws Exception;

    LoginResponse login(LoginRequest request) throws  Exception;
}
