package com.rajesh.service.user;

import com.rajesh.dto.Auth.UserResponse;
import com.rajesh.dto.UserSearchResponse;
import com.rajesh.model.User;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserService {


    User getUserById(Long id) throws Exception;

    List<User> getAllUsers();

    User updateUser(Long id,User user);

    void deleteUser(Long id) throws Exception;

    UserResponse getCurrentUser(String email);

    @Query("""
    SELECT u FROM User u
    WHERE u.email <> :currentEmail
    AND (
        LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%'))
        OR
        LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))
        )
    """)
    List<UserSearchResponse> searchUsers(String query,String currentUserEmail);
}
