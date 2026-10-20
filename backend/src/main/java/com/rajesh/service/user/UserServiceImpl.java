package com.rajesh.service.user;

import com.rajesh.Exception.UserNotFoundException;
import com.rajesh.dto.Auth.UserResponse;
import com.rajesh.model.User;
import com.rajesh.repository.UserRepository;
import com.rajesh.service.Presence.PresenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PresenceService presenceService;


    @Override
    public User getUserById(Long id) throws Exception {

        if (id == null && !userRepository.existsById(id)) {
            throw new UserNotFoundException(
                    "User with id " + id + " not found"
            );
        }
        return userRepository.findById(id).orElseThrow(
                ()->   new UserNotFoundException(
                        "User with id " + id + " not found"
                ));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    @Override
    public User updateUser(Long id, User user) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(()->new RuntimeException("user not found with id: "+ id));
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhoneNumber(user.getPhoneNumber());
        existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
        existingUser.setRole(user.getRole());
        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUser(Long id) {

        if (id == null) {
            throw new IllegalArgumentException("User ID is required");
        }

        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException(
                    "User with id " + id + " not found"
            );
        }

        userRepository.deleteById(id);
    }


    public UserResponse getCurrentUser(String email) {

        User user = userRepository.findByEmail(email).orElseThrow(
                ()->new UserNotFoundException("User not found with email "+ email)
        );

        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

}
