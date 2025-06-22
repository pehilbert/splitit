import type { Expense } from "./model";

export function getTotalPaid(expense: Expense): number {
    let total = expense.payerPortionAmount;
    expense.splitBetween.forEach(split => total += split.amountPaid);
    return total;
}