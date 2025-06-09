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
    payerPortionAmount: number
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

export function createEmptyExpense(): Expense {
    return {
        id: crypto.randomUUID(),
        title: '',
        description: '',
        date: new Date().toISOString(),
        totalCost: 0,
        paidById: '',
        payerPortionAmount: 0,
        splitBetween: []
    };
}

export function createEmptyPerson(): Person {
    return {
        id: crypto.randomUUID(),
        name: ''
    };
}