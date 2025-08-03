import { createExpenseForGroup, deleteExpense, updateExpense, type CreateExpenseRequest, type ExpenseJson, type UpdateExpenseRequest } from "./expenseRepository";
import { addGroupMember, createGroup, type GroupJson } from "./groupRepository";
import { authenticateUser } from "./userRepository";

describe("Expense Repository E2E", () => {
    const testUsername = "e2egrouptest";
    const testPassword = "password123"
    const testSecondUserId = 18;
    let group: GroupJson;
    let expense: ExpenseJson;
    let token = '';
    
    const testExpense: CreateExpenseRequest = {
        title: "Test Expense",
        description: "For a test",
        date: (() => {
            const d = new Date();
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        })(),
        total_cost: 100,
        payer_portion: 50,
        splits: [
            {
                user_id: testSecondUserId,
                amount_owed: 50,
                amount_paid: 0
            }
        ]
    }

    const testExpenseUpdate: UpdateExpenseRequest = {
        description: "Updated description",
        splits: [
            {
                user_id: testSecondUserId,
                amount_owed: 50,
                amount_paid: 50
            }
        ]
    }

    it("create test group", async () => {
        const authResponse = await authenticateUser(testUsername, testPassword);
        expect(authResponse.access_token).toBeDefined();
        token = authResponse.access_token as string;

        const createGroupResponse = await createGroup({ name: "Expense Test Group" }, token);
        expect(createGroupResponse.group).toBeDefined();
        group = createGroupResponse.group as GroupJson;

        const addMemberResponse = await addGroupMember(group.id.toString(), { user_id: testSecondUserId }, token);
        expect(addMemberResponse.message).toBe("User added to group");
    });

    it("should create test expense", async () => {
        const response = await createExpenseForGroup(group.id.toString(), testExpense, token);
        expect(response.expense).toBeDefined();
        expense = response.expense as ExpenseJson;
    });

    it("should update expense", async () => {
        const response = await updateExpense(expense.id.toString(), testExpenseUpdate, token);
        expect(response.expense).toBeDefined();
        expect(response.expense?.description).toBe("Updated description");
        expect(response.expense?.splits?.[0].amount_paid).toBe(50);
    });

    it("should delete expense", async () => {
        const response = await deleteExpense(expense.id.toString(), token);
        expect(response.message).toBe("Expense deleted successfully");
    })
});