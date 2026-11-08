package com.rajesh.identity.repository;

import com.rajesh.identity.enums.TokenType;
import com.rajesh.identity.model.Token;
import com.rajesh.users.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    Optional<Token> findByValueAndType(String value, TokenType type);
    Optional<Token> findByValue(String value);
    List<Token> findByUserAndType(User user, TokenType type);
    void deleteByUser(User user);
}
