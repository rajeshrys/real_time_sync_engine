package com.rajesh.controller;

import com.rajesh.dto.Auth.register.RegisterRequest;
import com.rajesh.dto.Auth.register.RegisterResponse;
import com.rajesh.dto.Auth.Login.LoginRequest;
import com.rajesh.dto.Auth.Login.LoginResponse;
import com.rajesh.service.auth.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) throws Exception {
        RegisterResponse response  = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) throws Exception {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

}
