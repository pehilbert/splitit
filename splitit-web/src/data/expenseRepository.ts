import type { UserJson } from "./userRepository"

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
    user_id: string
    amount_paid: string
    amount_owed: string
    user: UserJson
}