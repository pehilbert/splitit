import { createContext, useContext, useState } from "react";
import type { Person } from "../types/model";

interface UserContextType {
    currentUser: Person | undefined

    updateCurrentUser: (newUser: Person | undefined) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, updateCurrentUser] = useState<Person | undefined>(undefined);

    return (
        <UserContext.Provider value={{currentUser, updateCurrentUser}}>
            {children}
        </UserContext.Provider>
    )
}

export function useUserContext(): UserContextType {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useGroups must be used within a GroupProvider");
    return ctx;
}