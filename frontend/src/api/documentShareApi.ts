import api from "./axios";
import type { DocumentMember, ShareDocumentRequest } from "../types/document";

export const shareDocument = async (
  documentId: number,
  data: ShareDocumentRequest
): Promise<DocumentMember> => {
  const response = await api.post<DocumentMember>(
    `/documents/share/${documentId}/members`,
    data
  );
  return response.data;
};

export const getDocumentMembers = async (
  documentId: number
): Promise<DocumentMember[]> => {
  const response = await api.get<DocumentMember[]>(
    `/documents/share/${documentId}/members`
  );
  return response.data;
};

export const updateMemberRole = async (
  documentId: number,
  userId: number,
  role: "EDITOR" | "VIEWER"
): Promise<DocumentMember> => {
  const response = await api.put<DocumentMember>(
    `/documents/share/${documentId}/members/${userId}`,
    { role }
  );
  return response.data;
};

export const removeMember = async (
  documentId: number,
  userId: number
): Promise<void> => {
  await api.delete(
    `/documents/share/${documentId}/members/${userId}`
  );
};
