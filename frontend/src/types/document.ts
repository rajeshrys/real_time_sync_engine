export type DocumentRole = "OWNER" | "EDITOR" | "VIEWER";
export interface Document{
    id: number;
    title: string;
    content:  object | null;
    ownderId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

export interface CreateDocumentRequest{
    title: string;
    content: object | null;
}

export interface UpdateDocumentRequest {
    title: string;
    content: object | null;
}

export interface DocumentResponse {
  id: number;
  title: string;
  content: object | null;
  ownerId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShareDocumentRequest {
    userId: number;
    role: DocumentRole;
}

export interface DocumentMember{
    userId: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    role: DocumentRole;
}


