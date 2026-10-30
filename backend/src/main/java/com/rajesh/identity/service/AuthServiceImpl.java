package com.rajesh.identity.service;

import com.rajesh.common.enums.UserRole;
import com.rajesh.common.exception.UserAlreadyExistsException;
import com.rajesh.common.security.JwtService;
import com.rajesh.identity.dto.LoginRequest;
import com.rajesh.identity.dto.LoginResponse;
import com.rajesh.identity.dto.RegisterRequest;
import com.rajesh.identity.dto.RegisterResponse;
import com.rajesh.identity.dto.UserResponse;
import com.rajesh.users.model.User;
import com.rajesh.users.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    @Override
    public RegisterResponse register(RegisterRequest request) throws Exception {
        if(userRepository.existsByEmail(request.getEmail())){
            throw new UserAlreadyExistsException("User already exists");
        }
        if(userRepository.existsByUsername(request.getUsername())){
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
    public LoginResponse login(LoginRequest request) throws Exception {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(()->new Exception("Invalid email"));
        if(!passwordEncoder.matches(request.getPassword(),user.getPassword())){
            throw new Exception("Invalid email or password");
        }
        String token =  jwtService.generateToken(user.getEmail());
        return LoginResponse.builder()
                .message("Login Successful")
                .token(token)
                .build();
    }
}