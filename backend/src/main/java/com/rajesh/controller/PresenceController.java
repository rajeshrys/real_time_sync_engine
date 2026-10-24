package com.rajesh.controller;

import com.rajesh.service.PresenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class PresenceController {

    private final PresenceService presenceService;

    @GetMapping("/api/presence/status")
    public boolean getPresenceStatus(
            @RequestParam String email
    ) {
        return presenceService.isOnline(email);
    }
}