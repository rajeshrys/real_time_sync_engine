package com.rajesh.service.Presence;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PresenceEvent {
    private Long userId;
    private String username;
    private String status;

}
