package com.rajesh.users.repository;

import com.rajesh.users.model.User;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    List<User> findByEmailContainingIgnoreCase(String email);
    List<User> findByUsernameContainingIgnoreCase(String username);
    Optional <User> findByUsername(String username);
    @Query("""
    SELECT u FROM User u
    WHERE u.email <> :currentEmail
    AND (
        LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%'))
        OR
        LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))
    )
""")
    List<User> searchUsers(
            @Param("query") String query,
            @Param("currentEmail") String currentEmail
    );
}