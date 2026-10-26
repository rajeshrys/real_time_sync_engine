import api from "./axios";

import { type Document,type CreateDocumentRequest,type UpdateDocumentRequest ,type DocumentResponse} from "../types/document";

export const createDocument = async(data: CreateDocumentRequest): Promise<Document> =>{
    const response = await api.post<Document>("/documents/new",data);
    return response.data;
}

export const getDocuments = async(): Promise<DocumentResponse[]> =>{
    const response = await api.get<DocumentResponse[]>("/documents");
    return response.data;
}


export const getDocumentById = async (
  id: number
): Promise<Document> => {
  const response = await api.get<Document>(`/documents/${id}`);
  return response.data;
};

export const getTrashDocuments= async():Promise<DocumentResponse[]> =>{
  const response = await api.get<DocumentResponse[]>(`/documents/trash`);
  return response.data;
}

export const updateDocument = async (
  id: number,
  data: UpdateDocumentRequest
): Promise<Document> => {
  const response = await api.put<Document>(
    `/documents/${id}`,
    data
  );

  return response.data;
};

export const deleteDocument = async (
  id: number
): Promise<void> => {
  await api.delete(`/documents/${id}`);
};

export const restoreDocument = async (
  id: number
): Promise<void> => {
  await api.post(`/documents/${id}/restore`);
};

export const permanentlyDeleteDocument = async (
  id: number
): Promise<void> => {
  await api.delete(`/documents/${id}/permanent`);
};

