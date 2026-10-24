package com.rajesh.controller;

import com.rajesh.model.User;
import com.rajesh.repository.UserRepository;
import com.rajesh.service.Presence.PresenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class PresenceController {

    private final PresenceService presenceService;
    private final UserRepository userRepository;

    @GetMapping("/api/presence/online")
    public List<Long> online() {   // change Long if your id type differs
        return presenceService.getOnlineUsers().stream()
                .map(userRepository::findByEmail)
                .flatMap(Optional::stream)
                .map(User::getId)
                .toList();
    }
}