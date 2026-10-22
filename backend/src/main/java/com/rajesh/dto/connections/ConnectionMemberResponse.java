package com.rajesh.dto.connections;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ConnectionMemberResponse {

    private long id;

    private String username;

    private String firstName;

    private String lastName;

    private String email;

    private boolean active;

}
