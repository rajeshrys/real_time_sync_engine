import api from "./axios";

export interface ConnectionRequest{
    connectionId: number;
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
}
export interface Member{
    id: number;
    username: string;
    lastName: string;
    firstName: string;
    email: string;
}
export interface ConnectionMember {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    active: boolean;
}

export const getConnections = async():Promise<ConnectionMember[]> =>{
    const response = await api.get<ConnectionMember[]>("/connections");
    return response.data;
}

export const sendConnectRequest = async(userId: number):Promise<void> =>{
    await api.post(`/connections/request/${userId}`);
}

export const getPendingRequests = async(): Promise<ConnectionRequest[]> =>{
    const response = await api.get<ConnectionRequest[]>(`/connections/requests`)
    return response.data;
}

export const acceptConnectionRequest = async(connectionId:number):Promise<void> =>{
    await api.put(`/connections/${connectionId}/accept`);
}

export const rejectConnectionRequest = async(connectionId:number) :Promise<void> =>{
    await api.put(`/connections/${connectionId}/reject`);
}
