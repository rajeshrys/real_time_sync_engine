package com.rajesh.identity.controller;

import com.rajesh.identity.dto.LoginRequest;
import com.rajesh.identity.dto.LoginResponse;
import com.rajesh.identity.dto.RegisterRequest;
import com.rajesh.identity.dto.RegisterResponse;
import com.rajesh.identity.service.AuthService;

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