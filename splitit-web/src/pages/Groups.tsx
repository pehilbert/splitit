import { Breadcrumb, Button, Container, Form, ListGroup, Modal } from "react-bootstrap";
import GroupListItem from "../components/GroupListItem";
import { useAuth } from '../context/Contexts';
import { useEffect, useState, useCallback } from "react";
import { type Group } from "../types/model";
import { createEmptyGroup } from "../types/util";
import { createGroup, getGroupsForUser } from "../data/groupRepository";
import { groupJsonToGroup } from "../data/mapping";

function Groups() {
    const { currentUser, token } = useAuth();

    const [groups, setGroups] = useState<Group[]>([]);
    const [showAddGroupModal, setShowAddGroupModal] = useState<boolean>(false);
    const [newGroup, setNewGroup] = useState<Group>(createEmptyGroup());
    const [inputError, setInputError] = useState<string | null>(null);

    const updateGroups = useCallback(async () => {
        if (!currentUser) return;
        const response = await getGroupsForUser(currentUser.id);
        if (response.groups) {
            setGroups(response.groups.map(json => groupJsonToGroup(json)));
        } else {
            console.error("Error fetching groups", response);
        }
    }, [currentUser]);

    useEffect(() => {
        updateGroups();
    }, [updateGroups]);

    async function handleAddGroup() {
        const trimmedName = newGroup.name.trim();

        if (trimmedName === '') {
            setInputError("Group name cannot be empty");
            return;
        }

        const nameExists = groups.some(
            (group) => group.name.trim().toLowerCase() === trimmedName.toLowerCase()
        )

        if (nameExists) {
            setInputError("You are already in a group with that name");
            return;
        }

        if (!currentUser || !token) {
            setInputError("Please sign in to create a group");
            return;
        }

        const createGroupResponse = await createGroup({name: newGroup.name}, token);

        if (createGroupResponse.group) {
            setNewGroup(createEmptyGroup());
            updateGroups();
            setShowAddGroupModal(false);
        } else {
            console.error("Error creating group", createGroupResponse);
            setInputError(createGroupResponse.message || '');
        }
    }

    if (!currentUser) {
        return (
            <Container className="mt-3 ms-1">
                <h1>You must be signed in</h1>
            </Container>
        )
    }

    return (
        <Container className="mt-3 ms-1">
            <Breadcrumb>
                <Breadcrumb.Item active>Groups</Breadcrumb.Item>
            </Breadcrumb>
            <ListGroup>
                {groups.map((group, index) => (
                    <ListGroup.Item as={GroupListItem} key={index} group={group} updateGroupsCallback={updateGroups}/>
                ))}
            </ListGroup>
            <Button className='mt-2' onClick={() => setShowAddGroupModal(true)}>Add Group</Button>

            {/* Add Group Modal */}
            
            <Modal 
                show={showAddGroupModal} 
                onHide={() => setShowAddGroupModal(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Create New Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Control
                            type='text'
                            placeholder='Group Name'
                            value={newGroup.name}
                            onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                            isInvalid={!!inputError}
                        />
                        <Form.Control.Feedback type='invalid'>
                            {inputError}
                        </Form.Control.Feedback>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddGroupModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleAddGroup}>Add</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
   return (<></>);
}

export default Groups