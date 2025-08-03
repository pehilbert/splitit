import type { Expense } from "./model";

export function getTotalPaid(expense: Expense): number {
    let total = expense.payerPortion;
    expense.splits.forEach(split => total += split.amountPaid);
    return total;
}

export function getTotalOwed(expense: Expense): number {
    let total = expense.payerPortion;
    expense.splits.forEach(split => total += split.amountOwed);
    return total;
}