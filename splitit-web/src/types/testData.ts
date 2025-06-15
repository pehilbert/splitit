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
      payerPortionAmount: 30,
      splitBetween: [
        {
          personId: "p2",
          amountPaid: 0,
          amountOwed: 30
        },
        {
          personId: "p3",
          amountPaid: 0,
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
      payerPortionAmount: 20,
      splitBetween: [
        {
          personId: "p1",
          amountPaid: 0,
          amountOwed: 20
        },
        {
          personId: "p2",
          amountPaid: 0,
          amountOwed: 20
        }
      ]
    }
  ]
};
