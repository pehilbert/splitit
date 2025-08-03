import type { Expense, ExpenseSplit, Group, User } from "../types/model";
import type { ExpenseJson, ExpenseSplitJson } from "./expenseRepository";
import type { GroupJson } from "./groupRepository";
import type { UserJson } from "./userRepository";

export function userJsonToUser(json: UserJson): User {
    return {
        id: json.id.toString(),
        username: json.username,
        firstName: json.first_name,
        lastName: json.last_name
    }
}

export function groupJsonToGroup(json: GroupJson): Group {
    return {
        id: json.id.toString(),
        name: json.name,
        owner: userJsonToUser(json.owner),
        members: json.members.map(userJson => userJsonToUser(userJson)),
        expenses: json.expenses.map(expenseJson => expenseJsonToExpense(expenseJson))
    }
}

export function expenseJsonToExpense(json: ExpenseJson): Expense {
    return {
        id: json.id.toString(),
        title: json.title,
        description: json.description,
        date: new Date(json.date),
        totalCost: json.totalCost,
        payerPortion: json.payer_portion,
        paidBy: userJsonToUser(json.paid_by),
        splits: json.splits.map(splitJson => expenseSplitJsonToExpenseSplit(splitJson))
    }
}

export function expenseSplitJsonToExpenseSplit(json: ExpenseSplitJson): ExpenseSplit {
    return {
        user: userJsonToUser(json.user),
        amountOwed: json.amount_owed,
        amountPaid: json.amount_paid
    }
}