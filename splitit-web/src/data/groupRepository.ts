import axios, { AxiosError } from "axios"
import type { ExpenseJson } from "./expenseRepository"
import type { UserJson } from "./userRepository"
import { API_BASE_URL } from "./constants"

export type GroupJson = {
    id: number
    name: string
    owner_id: number
    owner: UserJson
    members: UserJson[]
    expenses: ExpenseJson[]
}

export type GetGroupResponse = {
    groups?: GroupJson[]
    message?: string
    error?: string
}

export type CreateGroupRequest = {
    name: string
}

export type CreateGroupResponse = {
    message?: string
    error?: string
    group?: GroupJson
}

export type UpdateGroupRequest = {
    name?: string
}

export type UpdateGroupResponse = {
    message?: string
    error?: string
    group?: GroupJson
}

export type DeleteGroupResponse = {
    message?: string
    error?: string
}

export type AddGroupMemberRequest = {
    user_id: number
}

export type AddGroupMemberResponse = {
    error?: string
    message?: string
}

export type RemoveGroupMemberRequest = {
    user_id: number
}

export type RemoveGroupMemberResponse = {
    error?: string
    message?: string
}

const axiosInstance = axios.create({
    baseURL: API_BASE_URL
});

export async function getGroupById(id: string): Promise<GetGroupResponse> {
    try {
        const response = await axiosInstance.get<GetGroupResponse>(`/groups/?group_id=${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data ?? { message: "Something went wrong." };
        }

        return { message: "Something went wrong." };
    }
}

export async function getGroupsForUser(id: string): Promise<GetGroupResponse> {
    try {
        const response = await axiosInstance.get<GetGroupResponse>(`/groups/?user_id=${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data ?? { message: "Something went wrong." };
        }

        return { message: "Something went wrong." };
    }
}

export async function createGroup(request: CreateGroupRequest, token: string): Promise<CreateGroupResponse> {
    try {
        const response = await axiosInstance.post<CreateGroupResponse>(
            `/groups/`,
            request,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data ?? { message: "Something went wrong." };
        }

        return { message: "Something went wrong." };
    }
}

export async function updateGroup(id: string, request: UpdateGroupRequest, token: string): Promise<UpdateGroupResponse> {
    try {
        const response = await axiosInstance.post<UpdateGroupResponse>(
            `/groups/?group_id=${id}`,
            request,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data ?? { message: "Something went wrong." };
        }

        return { message: "Something went wrong." };
    }
}

export async function deleteGroup(id: string, token: string): Promise<DeleteGroupResponse> {
    try {
        const response = await axiosInstance.delete<DeleteGroupResponse>(
            `/groups/?group_id=${id}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data ?? { message: "Something went wrong." };
        }

        return { message: "Something went wrong." };
    }
}

export async function addGroupMember(id: string, request: AddGroupMemberRequest, token: string): Promise<AddGroupMemberResponse> {
    try {
        const response = await axiosInstance.post<AddGroupMemberResponse>(
            `/groups/members?group_id=${id}`,
            request,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data ?? { message: "Something went wrong." };
        }

        return { message: "Something went wrong." };
    }
}

export async function removeGroupMember(id: string, request: RemoveGroupMemberRequest, token: string): Promise<RemoveGroupMemberResponse> {
    try {
        const response = await axiosInstance.request<RemoveGroupMemberResponse>(
            {
                method: 'DELETE',
                url: `/groups/members?group_id=${id}`,
                data: request,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data ?? { message: "Something went wrong." };
        }

        return { message: "Something went wrong." };
    }
}