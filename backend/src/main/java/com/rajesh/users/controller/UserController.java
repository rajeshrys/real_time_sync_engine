package com.rajesh.users.controller;

import com.rajesh.identity.dto.UserResponse;
import com.rajesh.users.dto.UserSearchResponse;
import com.rajesh.users.model.User;
import com.rajesh.users.service.UserService;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<List<UserSearchResponse>> searchUsers (@RequestParam String q,Authentication authentication){
        String currentUserEmail = authentication.getName();
        return ResponseEntity.ok(userService.searchUsers(q,currentUserEmail));
    }
}