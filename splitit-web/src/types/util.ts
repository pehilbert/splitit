import type { Expense, Group, User } from "./model";

export function createEmptyUser(): User {
    return {
        id: '',
        username: '',
        firstName: '',
        lastName: ''
    }
}

export function createEmptyGroup(): Group {
    return {
        id: '',
        name: '',
        owner: createEmptyUser(),
        members: [],
        expenses: []
    }
}

export function createEmptyExpense(): Expense {
    return {
        id: '',
        title: '',
        description: '',
        date: new Date(),
        totalCost: 0,
        payerPortion: 0,
        paidBy: createEmptyUser(),
        splits: []
    }
}