import api from './axios';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
}


export interface User {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
}

export const login = async(data: LoginRequest)=>{
    const response = await api.post("/auth/login",data);
    return response.data;
}

export const register = async(data: RegisterRequest)=>{
    const response = await api.post("/auth/register",data);
    return response.data;
}

export const getCurrentUser = async()=>{
    const response = await api.get("/users/me");
    return response.data;
}
