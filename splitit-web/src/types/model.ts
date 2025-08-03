export type User = {
    id: string
    username: string
    firstName: string
    lastName: string
}

export type Group = {
    id: string
    name: string
    owner: User
    members: User[]
    expenses: Expense[]
}

export type Expense = {
    id: string
    title: string
    description: string
    date: Date
    totalCost: number
    payerPortion: number
    paidBy: User
    splits: ExpenseSplit[]
}

export type ExpenseSplit = {
    user: User,
    amountPaid: number,
    amountOwed: number
}