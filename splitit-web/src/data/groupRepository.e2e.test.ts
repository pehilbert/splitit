import { addGroupMember, createGroup, deleteGroup, getGroupById, removeGroupMember, updateGroup } from "./groupRepository";
import { authenticateUser } from "./userRepository";

describe("Group Repository E2E", () => {
    let token = '';
    let group_id = '';
    const testSecondUserId = 18;

    it("should fetch a group by ID", async () => {
        const testGroupId = "1"; // Replace with a valid test group ID
        const response = await getGroupById(testGroupId);

        expect(response).toBeDefined();
        expect(response.groups).toBeDefined();
        expect(response.groups?.[0]?.id?.toString()).toBe(testGroupId);
    });

    it("should create a group", async () => {
        const testUsername = "e2egrouptest";
        const testPassword = "password123";

        const authResponse = await authenticateUser(testUsername, testPassword);
        expect(authResponse.access_token).toBeDefined();
        token = authResponse.access_token as string;

        const createGroupResponse = await createGroup({ name: "Test Group" }, token);
        expect(createGroupResponse.group).toBeDefined();
        group_id = createGroupResponse.group?.id.toString() as string;
    });

    it("should update group name", async () => {
        const updateResponse = await updateGroup(group_id, { name: "Updated Group"}, token);
        expect(updateResponse.group).toBeDefined();
        expect(updateResponse.group?.name).toBe("Updated Group");
    });

    it("should add second user to group", async () => {
        const response = await addGroupMember(group_id, {user_id: testSecondUserId}, token);
        expect(response.message).toBe("User added to group");
    });

    it("should remove second user from group", async () => {
        const response = await removeGroupMember(group_id, {user_id: testSecondUserId}, token);
        expect(response.message).toBe("User removed from group");
    });

    it("should delete the group", async () => {
        const deleteResponse = await deleteGroup(group_id, token);
        expect(deleteResponse.message).toBe("Group deleted successfully");
    });
});

