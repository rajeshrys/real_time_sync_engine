package com.rajesh.controller;

import com.rajesh.dto.Auth.UserResponse;
import com.rajesh.dto.UserSearchResponse;
import com.rajesh.model.User;
import com.rajesh.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/")
    public ResponseEntity<List<User>> getAllUsers(){
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id,@RequestBody User user){
        User updatedUser = userService.updateUser(id,user);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) throws Exception{
        userService.deleteUser(id);
        return ResponseEntity.ok("User Deleted Successfully");
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(Authentication authentication){
        String email = authentication.getName();
        UserResponse response = userService.getCurrentUser(email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public List<UserSearchResponse> searchUsers(@RequestParam String email,Authentication authentication){
        Long currentUserId = Long.parseLong(authentication.getName());
        return userService.searchUsers(email,currentUserId);
    }

}
