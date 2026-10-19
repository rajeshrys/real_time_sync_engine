package com.rajesh.dto;

public class CollaborationMessage {
    private Long documentId;

    private String type;
    private Object content;
    private Long userId;
    public CollaborationMessage(){

    }
    public CollaborationMessage(Long DocumentId,String type, Object content,Long userId){
        this.documentId = documentId;
        this.type = type;
        this.content = content;
        this.userId = userId;
    }
    public Long getDocumentId(){
        return documentId;
    }
    public void setDocumentId(Long documentId){
        this.documentId = documentId;
    }

    public String getType(){
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Object getContent() {
        return content;
    }

    public void setContent(Object content) {
        this.content = content;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

}
