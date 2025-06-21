import { Breadcrumb, Button, Container, Form, ListGroup, Modal } from "react-bootstrap";
import GroupListItem from "../components/GroupListItem";
import { useGroups } from "../context/GroupContext";
import { useState } from "react";
import { createEmptyGroup, type Group } from "../types/model";

function Groups() {
    const { groups, addGroup } = useGroups();
    const [showAddGroupModal, setShowAddGroupModal] = useState<boolean>(false);
    const [newGroup, setNewGroup] = useState<Group>(createEmptyGroup());
    const [inputError, setInputError] = useState<string | null>(null);
    
    function handleAddGroup() {
        const trimmedName = newGroup.name.trim();

        if (trimmedName === '') {
            setInputError("Group name cannot be empty");
            return;
        }

        const nameExists = groups.some(
            (group) => group.name.trim().toLowerCase() === trimmedName.toLowerCase()
        )

        if (nameExists) {
            setInputError("There is already a group with that name");
            return;
        }

        setShowAddGroupModal(false);
        setNewGroup(createEmptyGroup());
        addGroup(newGroup);
    }

    return (
        <Container className="mt-3 ms-1">
            <Breadcrumb>
                <Breadcrumb.Item active>Groups</Breadcrumb.Item>
            </Breadcrumb>
            <ListGroup>
                {groups.map((group, index) => (
                    <ListGroup.Item as={GroupListItem} key={index} group={group} />
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
}

export default Groups