package com.rajesh.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@NoArgsConstructor
@RequiredArgsConstructor
public class UserSearchResponse {

    private Long id;
    private String name;
    private String email;
    private boolean online;

    public UserSearchResponse(Long id, String name,String email,boolean online){

    }
}
