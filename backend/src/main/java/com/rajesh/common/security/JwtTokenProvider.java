package com.rajesh.common.security;

import com.rajesh.identity.model.Token;

public interface JwtTokenProvider {
    Token generateAccessToken();
}
