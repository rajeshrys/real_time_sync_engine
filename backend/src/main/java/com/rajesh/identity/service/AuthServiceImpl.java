package com.rajesh.identity.service;

import com.rajesh.common.enums.UserRole;
import com.rajesh.common.exception.UserAlreadyExistsException;
import com.rajesh.common.security.JwtService;
import com.rajesh.identity.dto.AuthTokens;
import com.rajesh.identity.dto.LoginRequest;
import com.rajesh.identity.dto.RegisterRequest;
import com.rajesh.identity.dto.RegisterResponse;
import com.rajesh.identity.dto.UserResponse;
import com.rajesh.identity.enums.TokenType;
import com.rajesh.identity.model.Token;
import com.rajesh.identity.repository.TokenRepository;
import com.rajesh.users.model.User;
import com.rajesh.users.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenRepository tokenRepository;

    @Value("${jwt.refresh-expiration:604800000}")
    private long refreshExpiration;

    @Override
    public RegisterResponse register(RegisterRequest request) throws Exception {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("User already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        User user = User.builder()
                .username(request.getUsername())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.CUSTOMER)
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .build();
        User savedUser = userRepository.save(user);
        return RegisterResponse.builder()
                .message("User registered successfully")
                .user(
                        UserResponse.builder()
                                .id(savedUser.getId())
                                .firstName(savedUser.getFirstName())
                                .lastName(savedUser.getLastName())
                                .email(savedUser.getEmail())
                                .phoneNumber(savedUser.getPhoneNumber())
                                .role(savedUser.getRole())
                                .build()
                )
                .build();
    }

    @Override
    @Transactional
    public AuthTokens login(LoginRequest request) throws Exception {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String accessToken = jwtService.generateAccessToken(user.getEmail());
        Token refreshToken = createRefreshToken(user);

        return AuthTokens.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getValue())
                .build();
    }

    @Override
    @Transactional
    public AuthTokens refreshToken(String refreshTokenValue) throws Exception {
        Token token = tokenRepository.findByValueAndType(refreshTokenValue, TokenType.REFRESH)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        if (token.isDisabled() || token.getExpiryDate().isBefore(LocalDateTime.now())) {
            token.setDisabled(true);
            tokenRepository.save(token);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired or revoked");
        }

        // Token rotation: disable previous refresh token
        token.setDisabled(true);
        tokenRepository.save(token);

        User user = token.getUser();
        String newAccessToken = jwtService.generateAccessToken(user.getEmail());
        Token newRefreshToken = createRefreshToken(user);

        return AuthTokens.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken.getValue())
                .build();
    }

    @Override
    @Transactional
    public void logout(String refreshTokenValue) {
        if (refreshTokenValue == null || refreshTokenValue.isBlank()) {
            return;
        }
        tokenRepository.findByValueAndType(refreshTokenValue, TokenType.REFRESH)
                .ifPresent(token -> {
                    token.setDisabled(true);
                    tokenRepository.save(token);
                });
    }

    private Token createRefreshToken(User user) {
        Token token = Token.builder()
                .user(user)
                .type(TokenType.REFRESH)
                .value(UUID.randomUUID().toString())
                .expiryDate(LocalDateTime.now().plusSeconds(refreshExpiration / 1000))
                .disabled(false)
                .build();
        return tokenRepository.save(token);
    }
}
