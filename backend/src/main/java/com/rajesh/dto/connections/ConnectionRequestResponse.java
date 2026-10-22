package com.rajesh.dto.connections;

import com.rajesh.enums.ConnectionsStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionRequestResponse {

    private Long connectionId;
    private Long userId;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
}
