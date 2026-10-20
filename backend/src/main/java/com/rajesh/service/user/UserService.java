package com.rajesh.service.user;

import com.rajesh.dto.Auth.UserResponse;
import com.rajesh.model.User;

import java.util.List;

public interface UserService {


    User getUserById(Long id) throws Exception;

    List<User> getAllUsers();

    User updateUser(Long id,User user);

    void deleteUser(Long id) throws Exception;

    UserResponse getCurrentUser(String email);
}
