import { createContext, useState } from "react";
import type { Person } from "../types/model";

export interface UserContextType {
    currentUser: Person | undefined

    updateCurrentUser: (newUser: Person | undefined) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, updateCurrentUser] = useState<Person | undefined>(undefined);

    return (
        <UserContext.Provider value={{currentUser, updateCurrentUser}}>
            {children}
        </UserContext.Provider>
    )
}