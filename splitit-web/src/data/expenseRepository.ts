import axios, { AxiosError } from "axios"
import type { UserJson } from "./userRepository"
import { API_BASE_URL } from "./constants"

export type ExpenseJson = {
    id: number
    title: string
    description: string
    date: string
    totalCost: number
    paid_by_id: number
    payer_portion: number
    group_id: number
    paid_by: UserJson
    group: string
    splits: ExpenseSplitJson[]
}

export type ExpenseSplitJson = {
    user_id: number
    amount_paid: number
    amount_owed: number
    user: UserJson
}

export type GetExpensesResponse = {
    message?: string
    error?: string
    group?: {
        id: number
        name: string
        owner_id: number
        owner: UserJson
        members: UserJson[]
    }
    expenses?: ExpenseJson[]
}

export type CreateExpenseRequest = {
    title: string
    description: string
    date: string
    total_cost: number
    payer_portion: number
    splits: NewExpenseSplit[]
}

export type NewExpenseSplit = {
    user_id: number
    amount_paid: number
    amount_owed: number
}

export type CreateExpenseResponse = {
    message?: string
    error?: string
    expense?: ExpenseJson
}

export type UpdateExpenseRequest = {
    title?: string
    description?: string
    total_cost?: number
    payer_portion?: number
    splits?: ExpenseSplitUpdate[]
}

export type ExpenseSplitUpdate = {
    user_id: number
    amount_paid: number
    amount_owed: number
}

export type UpdateExpenseResponse = {
    message?: string
    error?: string
    expense?: ExpenseJson
}

export type DeleteExpenseResponse = {
    message?: string
    error?: string
}

const axiosInstance = axios.create({
    baseURL: API_BASE_URL
});

export async function getExpensesForGroup(groupId: string): Promise<GetExpensesResponse> {
    try {
        const response = await axiosInstance.get<GetExpensesResponse>(`/expenses/?group_id=${groupId}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return error.response?.data ?? { message: "Something went wrong." };
        }
        return { message: "Something went wrong." };
    }
}

export async function createExpenseForGroup(groupId: string, request: CreateExpenseRequest, token: string): Promise<CreateExpenseResponse> {
    try {
        const response = await axiosInstance.post<CreateExpenseResponse>(
            `/expenses/?group_id=${groupId}`,
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

export async function updateExpense(id: string, request: UpdateExpenseRequest, token: string): Promise<CreateExpenseResponse> {
    try {
        const response = await axiosInstance.put<UpdateExpenseResponse>(
            `/expenses/?expense_id=${id}`,
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

export async function deleteExpense(id: string, token: string): Promise<DeleteExpenseResponse> {
    try {
        const response = await axiosInstance.delete<DeleteExpenseResponse>(
            `/expenses/?expense_id=${id}`,
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