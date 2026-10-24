package com.rajesh.config;

import com.rajesh.security.CustomerUserDetailsService;
import com.rajesh.service.auth.JwtService;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;
    private final CustomerUserDetailsService userDetailsService;

    public WebSocketAuthInterceptor(
            JwtService jwtService,
            CustomerUserDetailsService userDetailsService
    ) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public Message<?> preSend(
            Message<?> message,
            MessageChannel channel
    ) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String authHeader =
                    accessor.getFirstNativeHeader("Authorization");

            if (authHeader == null ||
                    !authHeader.startsWith("Bearer ")) {

                System.out.println(
                        "❌ No WebSocket Authorization header"
                );

                return message;
            }

            String token = authHeader.substring(7);

            try {

                String email =
                        jwtService.extractUsername(token);

                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(email);

                if (jwtService.isTokenValid(token, userDetails)) {

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    // 🔥 Attach authenticated user to STOMP session
                    accessor.setUser(authentication);

                    System.out.println(
                            "🔥 WebSocket authentication SUCCESS: "
                                    + email
                    );

                    System.out.println(
                            "🔥 Principal attached: "
                                    + accessor.getUser()
                    );

                    // 🔥 Return message containing modified headers
                    return org.springframework.messaging.support.MessageBuilder
                            .createMessage(
                                    message.getPayload(),
                                    accessor.getMessageHeaders()
                            );
                }

            } catch (Exception e) {

                System.out.println(
                        "❌ WebSocket authentication failed: "
                                + e.getMessage()
                );
            }
        }

        return message;
    }
}