package com.rajesh.identity.controller;

import com.rajesh.identity.dto.AuthTokens;
import com.rajesh.identity.dto.LoginRequest;
import com.rajesh.identity.dto.LoginResponse;
import com.rajesh.identity.dto.RegisterRequest;
import com.rajesh.identity.dto.RegisterResponse;
import com.rajesh.identity.service.AuthService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @Value("${jwt.cookie-name:refreshToken}")
    private String cookieName;

    @Value("${jwt.refresh-expiration:604800000}")
    private long refreshExpiration;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) throws Exception {
        RegisterResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request,
            HttpServletResponse servletResponse
    ) throws Exception {
        AuthTokens tokens = authService.login(request);
        setRefreshTokenCookie(servletResponse, tokens.getRefreshToken());

        LoginResponse response = LoginResponse.builder()
                .message("Login Successful")
                .accessToken(tokens.getAccessToken())
                .token(tokens.getAccessToken())
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(
            @CookieValue(name = "${jwt.cookie-name:refreshToken}", required = false) String refreshToken,
            HttpServletResponse servletResponse
    ) throws Exception {
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(LoginResponse.builder().message("Refresh token is missing").build());
        }

        try {
            AuthTokens tokens = authService.refreshToken(refreshToken);
            setRefreshTokenCookie(servletResponse, tokens.getRefreshToken());

            LoginResponse response = LoginResponse.builder()
                    .message("Token refreshed successfully")
                    .accessToken(tokens.getAccessToken())
                    .token(tokens.getAccessToken())
                    .build();
            return ResponseEntity.ok(response);
        } catch (ResponseStatusException e) {
            clearRefreshTokenCookie(servletResponse);
            return ResponseEntity.status(e.getStatusCode())
                    .body(LoginResponse.builder().message(e.getReason()).build());
        } catch (Exception e) {
            clearRefreshTokenCookie(servletResponse);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(LoginResponse.builder().message("Failed to refresh token").build());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            @CookieValue(name = "${jwt.cookie-name:refreshToken}", required = false) String refreshToken,
            HttpServletResponse servletResponse
    ) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            authService.logout(refreshToken);
        }
        clearRefreshTokenCookie(servletResponse);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String tokenValue) {
        ResponseCookie cookie = ResponseCookie.from(cookieName, tokenValue)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/api/auth")
                .maxAge(refreshExpiration / 1000)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearRefreshTokenCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(cookieName, "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/api/auth")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
