export interface Document{
    id: number;
    title: string;
    content:  object | null;
    ownderId: number;
    createdAt: string;
    updatedAt: string;
};

export interface CreateDocumentRequest{
    title: string;
    content: object | null;
}

export interface UpdateDocumentRequest {
    title: string;
    content: object | null;
}