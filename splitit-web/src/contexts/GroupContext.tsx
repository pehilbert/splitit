// src/context/GroupContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Group } from '../types/model';
import { exampleGroup } from '../types/testData';

// Define the shape of your context
interface GroupContextType {
    groups: Group[];
    getGroupById: (id: string) => Group | undefined;
    addGroup: (group: Group) => void;
    updateGroup: (group: Group) => void;
}

// Default values (optional fallback)
const GroupContext = createContext<GroupContextType | undefined>(undefined);

// Provider component
export const GroupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [groups, setGroups] = useState<Group[]>([]);

    // Example: Load from localStorage on mount
    useEffect(() => {
        setGroups([exampleGroup])
    }, []);

    // Save to localStorage whenever groups change
    /*
    useEffect(() => {
        localStorage.setItem('groups', JSON.stringify(groups));
    }, [groups]);
    */

    const getGroupById = (id: string) => groups.find(g => g.id === id);

    const addGroup = (group: Group) => {
        setGroups(prev => [...prev, group]);
    };

    const updateGroup = (group: Group) => {
        setGroups(prev => prev.map(g => (g.id === group.id ? group : g)));
    };

    return (
        <GroupContext.Provider value={{ groups, getGroupById, addGroup, updateGroup }}>
            {children}
        </GroupContext.Provider>
    );
};

export const useGroups = (): GroupContextType => {
    const ctx = useContext(GroupContext);
    if (!ctx) throw new Error("useGroups must be used within a GroupProvider");
    return ctx;
};
