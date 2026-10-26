import api from "./axios";

import type { DocumentMember,ShareDocumentRequest} from "../types/document";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};


export const getDocumentMembers = async (
  documentId: number
): Promise<DocumentMember[]> => {
  const response = await api.get(
    `documents/share//${documentId}/members`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const updateMemberRole = async (
  documentId: number,
  userId: number,
  role: "EDITOR" | "VIEWER"
): Promise<DocumentMember> => {
  const response = await api.put(
    `documents/share/${documentId}/members/${userId}`,
    { role },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const removeMember = async (
  documentId: number,
  userId: number
): Promise<void> => {
  await api.delete(
    `documents/share/${documentId}/members/${userId}`,
    {
      headers: getAuthHeaders(),
    }
  );
};