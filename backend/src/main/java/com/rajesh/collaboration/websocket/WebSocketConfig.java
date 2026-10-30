package com.rajesh.collaboration.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private final WebSocketAuthInterceptor webSocketAuthInterceptor;
    public WebSocketConfig(
            WebSocketAuthInterceptor webSocketAuthInterceptor
    ) {
        this.webSocketAuthInterceptor = webSocketAuthInterceptor;
    }
    @Override
    public void configureMessageBroker(
            MessageBrokerRegistry registry
    ) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }
    @Override
    public void registerStompEndpoints(
            StompEndpointRegistry registry
    ) {
        registry
                .addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5173");
    }
    @Override
    public void configureClientInboundChannel(
            org.springframework.messaging.simp.config.ChannelRegistration registration
    ) {
        registration.interceptors(
                webSocketAuthInterceptor
        );
    }
}