import { createContext, useContext } from "react";
import type { Expense, Group, User } from "../types/model";

// Contexts
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const GroupContext = createContext<GroupContextType | undefined>(undefined);

// Hooks
export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within a AuthProvider");
    return ctx;
}

export function useGroups(): GroupContextType {
    const ctx = useContext(GroupContext);
    if (!ctx) throw new Error("useGroups must be used within a GroupProvider");
    return ctx;
}

// Context interfaces
export interface AuthContextType {
    currentUser: User | undefined;
    token: string | undefined;

    authenticate: (username: string, password: string) => void;
    logOut: () => void;
}

export interface GroupContextType {
    groups: Group[];

    getGroupById: (id: string) => Group | undefined;
    addGroup: (group: Group) => void;
    updateGroup: (group: Group) => void;
    removeGroup: (id: string) => void;

    getPersonById: (groupId: string, personId: string) => User | undefined;
    addPerson: (groupId: string, person: User) => void;
    updatePerson: (groupId: string, newPerson: User) => void;
    removePerson: (groupId: string, personId: string) => void;

    getExpenseById: (groupId: string, expenseId: string) => Expense | undefined;
    addExpense: (groupId: string, expense: Expense) => void;
    updateExpense: (groupId: string, newExpense: Expense) => void;
    removeExpense: (groupId: string, expenseId: string) => void;
}

