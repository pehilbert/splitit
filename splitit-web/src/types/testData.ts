import type { Group } from "./model";

export const exampleGroup: Group = {
  id: "group-1",
  name: "Roommates",
  people: [
    { id: "p1", name: "Alice" },
    { id: "p2", name: "Bob" },
    { id: "p3", name: "Charlie" }
  ],
  expenses: [
    {
      id: "e1",
      title: "Groceries",
      date: "2025-06-01T12:00:00.000Z",
      description: "Weekly grocery run at Safeway",
      totalCost: 90,
      paidById: "p1", // Alice paid
      splitBetween: [
        {
          personId: "p2",
          portionAmount: 30,
          amountOwed: 30
        },
        {
          personId: "p3",
          portionAmount: 30,
          amountOwed: 30
        }
      ]
    },
    {
      id: "e2",
      title: "Pizza Night",
      date: "2025-06-03T19:30:00.000Z",
      description: "Late-night pizza delivery",
      totalCost: 60,
      paidById: "p3", // Charlie paid
      splitBetween: [
        {
          personId: "p1",
          portionAmount: 20,
          amountOwed: 20
        },
        {
          personId: "p2",
          portionAmount: 20,
          amountOwed: 20
        }
      ]
    }
  ]
};
