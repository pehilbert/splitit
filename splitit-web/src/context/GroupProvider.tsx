import React, { useState, useEffect } from 'react';
import { type Expense, type Group, type Person } from '../types/model';
import { GroupContext } from './Contexts';

// Helpers
function loadGroups(): Group[] {
    const groups = localStorage.getItem('groups');
    console.log("Groups loaded:", groups);

    if (groups) {
        const groupsObject = JSON.parse(groups);
        console.log("Groups object loaded:");
        console.log(groupsObject);
        return groupsObject;
    }
    
    return [];
}

// Provider component
export const GroupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [groups, setGroups] = useState<Group[]>(loadGroups());

    // Save to localStorage whenever groups change
    useEffect(() => {
        console.log("Groups saved:", JSON.stringify(groups));
        localStorage.setItem('groups', JSON.stringify(groups));
    }, [groups])

    // Group functions
    const getGroupById = (id: string) => {
        const group = groups.find(g => g.id === id);

        if (group) {
            console.log("Group found:", group.id, group.name);
            return group;
        }

        console.log("Group", id, "not found");
    }

    const addGroup = (group: Group) => {
        setGroups(prev => [...prev, group]);
        console.log("Group added:", group.id, group.name);
    }

    const updateGroup = (group: Group) => {
        setGroups(prev => prev.map(g => (g.id === group.id ? group : g)));
        console.log("Updated group:", group.id, group.name);
    }

    const removeGroup = (id: string) => {
        setGroups(prev => prev.filter(g => (g.id !== id)));
        console.log("Removed group:", id);
    }

    // Person functions
    const getPersonById = (groupId: string, personId: string) => {
        const group = getGroupById(groupId);
        const person = group?.people.find(p => p.id === personId);

        if (group && person) {
            console.log("Person found:", personId, person.name, "in group", groupId, group.name);
            return person;
        }

        console.log("Person", personId, "not found in group", groupId);
    }

    const addPerson = (groupId: string, person: Person) => {
        const group = getGroupById(groupId);

        if (group) {
            console.log("Added person", person.id, person.name, "to group", group.id, group.name);
            group.people.push(person);
            updateGroup(group);
        } else {
            console.log("Could not add person", person.id, ": group", groupId, "not found");
        }
    }

    const updatePerson = (groupId: string, newPerson: Person) => {
        const group = getGroupById(groupId);
        
        if (group) {
            group.people = group.people.map(p => (p.id === newPerson.id ? newPerson : p));
            updateGroup(group);
            console.log("Updated person", newPerson.id, newPerson.name, "to group", group.id, group.name);
        } else {
            console.log("Could not update person", newPerson.id, ": group", groupId, "not found");
        }
    }

    const removePerson = (groupId: string, personId: string) => {
        const group = getGroupById(groupId);
        
        if (group) {
            group.people = group.people.filter(p => p.id !== personId);
            updateGroup(group);
            console.log("Removed person", personId, "from group", group.id, group.name);
        } else {
            console.log("Could not remove person", personId, ": group", groupId, "not found");
        }
    }

    // Expense functions
    const getExpenseById = (groupId: string, expenseId: string) => {
        const group = getGroupById(groupId);
        const expense = group?.expenses.find(e => e.id === expenseId);

        if (group && expense) {
            console.log("Expense found:", expenseId, expense.title, "in group", groupId, group.name);
            return expense;
        }

        console.log("Expense", expenseId, "not found in group", groupId);
    }

    const addExpense = (groupId: string, expense: Expense) => {
        const group = getGroupById(groupId);

        if (group) {
            console.log("Added expense", expense.id, expense.title, "to group", group.id, group.name);
            group.expenses.push(expense);
            updateGroup(group);
        } else {
            console.log("Could not add expense", expense.id, ": group", groupId, "not found");
        }
    }

    const updateExpense = (groupId: string, newExpense: Expense) => {
        const group = getGroupById(groupId);
        
        if (group) {
            group.expenses = group.expenses.map(e => (e.id === newExpense.id ? newExpense : e));
            updateGroup(group);
            console.log("Updated expense", newExpense.id, newExpense.title, "to group", group.id, group.name);
        } else {
            console.log("Could not update expense", newExpense.id, ": group", groupId, "not found");
        }
    }

    const removeExpense = (groupId: string, expenseId: string) => {
        const group = getGroupById(groupId);
        
        if (group) {
            group.expenses = group.expenses.filter(e => e.id !== expenseId);
            updateGroup(group);
            console.log("Removed expense", expenseId, "from group", group.id, group.name);
        } else {
            console.log("Could not remove expense", expenseId, ": group", groupId, "not found");
        }
    }

    return (
        <GroupContext.Provider value={{ groups, getGroupById, addGroup, updateGroup, removeGroup, 
                                        getExpenseById, addExpense, updateExpense, removeExpense,
                                        getPersonById, addPerson, updatePerson, removePerson }}>
            {children}
        </GroupContext.Provider>
    );
};
