package com.rajesh.dto.Auth;

import com.rajesh.enums.UserRole;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {

    private Long id;

    @NotBlank(message = "firstname is required")
    private String firstName;

    @NotBlank(message = "lastname is required")
    private String lastName;

    @NotBlank(message = "email is required")
    private String email;

    @NotBlank(message = "phone number cannot be blank")
    private Long phoneNumber;

    @NotBlank(message = "role is required")
    private UserRole role;

}
