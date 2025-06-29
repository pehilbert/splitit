import { createContext, useContext } from "react";
import type { Expense, Group, Person } from "../types/model";

// Contexts
export const GroupContext = createContext<GroupContextType | undefined>(undefined);
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Hooks
export function useUserContext(): UserContextType {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useGroups must be used within a GroupProvider");
    return ctx;
}

export function useGroups(): GroupContextType {
    const ctx = useContext(GroupContext);
    if (!ctx) throw new Error("useGroups must be used within a GroupProvider");
    return ctx;
}

// Context interfaces
export interface UserContextType {
    currentUser: Person | undefined;

    updateCurrentUser: (newUser: Person | undefined) => void;
}

export interface GroupContextType {
    groups: Group[];

    getGroupById: (id: string) => Group | undefined;
    addGroup: (group: Group) => void;
    updateGroup: (group: Group) => void;
    removeGroup: (id: string) => void;

    getPersonById: (groupId: string, personId: string) => Person | undefined;
    addPerson: (groupId: string, person: Person) => void;
    updatePerson: (groupId: string, newPerson: Person) => void;
    removePerson: (groupId: string, personId: string) => void;

    getExpenseById: (groupId: string, expenseId: string) => Expense | undefined;
    addExpense: (groupId: string, expense: Expense) => void;
    updateExpense: (groupId: string, newExpense: Expense) => void;
    removeExpense: (groupId: string, expenseId: string) => void;
}

