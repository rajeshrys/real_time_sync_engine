package com.rajesh.controller;

import com.rajesh.dto.CollaborationMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class CollaborationController {
    private final SimpMessagingTemplate messagingTemplate;

    public CollaborationController(
            SimpMessagingTemplate messagingTemplate
    ) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/document")
    public void collaborate(CollaborationMessage message){
        Long documentId = message.getDocumentId();
        String destination = "/topic/document/" + documentId;
        messagingTemplate.convertAndSend(destination,message);

        System.out.println(
                "Broadcasting change to: " + destination
        );
    }
}
