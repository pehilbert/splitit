import {
    createNewUser,
    authenticateUser,
    updateUser,
    deleteUser
} from './userRepository';

describe('User Repository E2E', () => {
    let userId: string = '';
    let token: string = '';

    it('should create a user', async () => {
        const createRes = await createNewUser({
            username: 'e2etestuser',
            password: 'testpass',
            first_name: 'E2E',
            last_name: 'Test'
        });
        expect(createRes.user).toBeDefined();
        userId = createRes.user!.id.toString();
    });

    it('should authenticate a user', async () => {
        const authRes = await authenticateUser('e2etestuser', 'testpass');
        expect(authRes.access_token).toBeDefined();
        token = authRes.access_token!;
    });

    it('should update the user', async () => {
        const updateRes = await updateUser(userId, { first_name: 'Updated' }, token);
        expect(updateRes.user?.first_name).toBe('Updated');
    });

    it('should delete the user', async () => {
        const deleteRes = await deleteUser(userId, token);
        expect(deleteRes.message).toBe("User deleted successfully");
    });
});