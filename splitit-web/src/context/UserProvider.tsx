import { useState } from "react";
import type { User } from "../types/model";
import { UserContext } from "./Contexts";

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, updateCurrentUser] = useState<User | undefined>(undefined);

    return (
        <UserContext.Provider value={{currentUser, updateCurrentUser}}>
            {children}
        </UserContext.Provider>
    )
}