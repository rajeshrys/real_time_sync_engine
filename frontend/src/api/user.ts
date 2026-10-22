import api from "./axios";


export interface UserSearchResult{
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    connectionStatus: "PENDING" | "ACCEPTED" | "REJECT" | null;
}

export const searchUsers= async( query : string):Promise<UserSearchResult[]> =>{
    const response = await api.get<UserSearchResult[]>(
        `/users/search`,{
            params:{
                q: query
            },
        }
    );
    return response.data;
}