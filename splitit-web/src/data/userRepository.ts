import { API_BASE_URL } from "./constants"
import axios, { AxiosError } from "axios"

export type UserJson = {
    id: number
    username: string
    first_name: string
    last_name: string
}

export type GetUsersResponse = {
    message?: string
    error?: string
    users?: UserJson[]
}

export type CreateUserRequest = {
    username: string
    password: string
    first_name: string
    last_name: string
}

export type CreateUserResponse = {
    message?: string
    error?: string
    user?: UserJson
}

export type UpdateUserRequest = {
    username?: string
    password?: string
    first_name?: string
    last_name?: string
}

export type UpdateUserResponse = {
    message?: string
    error?: string
    user?: UserJson
}

export type DeleteUserResponse = {
    message?: string
    error?: string
}

export type AuthenticationResponse = {
    message?: string
    error?: string
    access_token?: string
    user?: UserJson
}

const axiosInstance = axios.create({
    baseURL: API_BASE_URL
});

export async function getUserById(id: string): Promise<GetUsersResponse> {
    try {
        const response = await axiosInstance.get<GetUsersResponse>(`/users/?user_id=${id}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return error.response?.data ?? { message: "Something went wrong." };
        }
        return { message: "Something went wrong." };
    }
}

export async function searchByUsername(username: string, limit: number = 5): Promise<GetUsersResponse> {
    try {
        const response = await axiosInstance.get<GetUsersResponse>(`/users/?username=${username}&?limit=${limit}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return error.response?.data ?? { message: "Something went wrong." };
        }
        return { message: "Something went wrong." };
    }
}

export async function createNewUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    try {
        const response = await axiosInstance.post<CreateUserResponse>(
            "/users",
            request,
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return error.response?.data ?? { message: "Something went wrong." };
        }
        return { message: "Something went wrong." };
    }
}

export async function updateUser(id: string, request: UpdateUserRequest, token: string): Promise<UpdateUserResponse> {
    try {
        const response = await axiosInstance.put<UpdateUserResponse>(
            `/users/?user_id=${id}`,
            request,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return error.response?.data ?? { message: "Something went wrong." };
        }
        return { message: "Something went wrong." };
    }
}

export async function deleteUser(id: string, token: string): Promise<DeleteUserResponse> {
    try {
        const response = await axiosInstance.delete<UpdateUserResponse>(
            `/users/?user_id=${id}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return error.response?.data ?? { message: "Something went wrong." };
        }
        return { message: "Something went wrong." };
    }
}

export async function authenticateUser(username: string, password: string): Promise<AuthenticationResponse> {
    try {
        const response = await axiosInstance.post<AuthenticationResponse>("/users/login", {username, password});
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return error.response?.data ?? { message: "Something went wrong." };
        }
        return { message: "Something went wrong." };
    }
}