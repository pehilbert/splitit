export type Person = {
    id: string
    name: string
}

export type Expense = {
    id: string
    title: string
    description: string
    date: string // ISO format
    totalCost: number
    paidById: string
    splitBetween: ExpenseSplit[]
}

export type ExpenseSplit = {
    personId: string
    portionAmount: number
    amountOwed: number
}

export type Group = {
    id: string
    name: string
    people: Person[]
    expenses: Expense[]
}