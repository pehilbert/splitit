import React, { useState } from "react";
import { AuthContext, type AuthContextType } from "./Contexts";
import type { User } from "../types/model";
import { authenticateUser, type UserJson } from "../data/userRepository";

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
    const [token, setToken] = useState<string | undefined>(undefined);

    const authenticate = async (username: string, password: string) => {
        const authResponse = await authenticateUser(username, password);

        if (authResponse.access_token && authResponse.user) {
            setCurrentUser(userJsonToUser(authResponse.user));
            setToken(authResponse.access_token);
        } else {
            console.error("Error authenticating user:", authResponse);
            throw authResponse.message;
        }
    };
    
    const logOut = () => {
        setCurrentUser(undefined);
        setToken(undefined);
    }

    const value: AuthContextType = {
        currentUser,
        token,
        authenticate,
        logOut
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

function userJsonToUser(json: UserJson): User {
    return {
        id: json.id.toString(),
        username: json.username,
        firstName: json.first_name,
        lastName: json.last_name
    }
}