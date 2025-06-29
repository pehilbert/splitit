import { useContext } from "react";
import { type UserContextType, UserContext } from "./UserContext";
import { type GroupContextType, GroupContext } from "./GroupContext";

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

