package com.rajesh.users.dto;

import com.rajesh.common.enums.ConnectionsStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchResponse {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private ConnectionsStatus connectionStatus;
}