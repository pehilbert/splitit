import { useState } from "react";
import type { Person } from "../types/model";
import { UserContext } from "./contexts";

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, updateCurrentUser] = useState<Person | undefined>(undefined);

    return (
        <UserContext.Provider value={{currentUser, updateCurrentUser}}>
            {children}
        </UserContext.Provider>
    )
}