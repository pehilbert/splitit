import { Button, Card, Col, Row } from "react-bootstrap"
import type { Group } from "../types/model"
import { Link } from "react-router-dom";
import { deleteGroup } from "../data/groupRepository";
import { useAuth } from "../context/Contexts";

function GroupListItem({ group, updateGroupsCallback } : {group: Group, updateGroupsCallback: () => void}) {
    const {token} = useAuth();
    const peopleString: string = group.members.map((user => user.firstName)).join(", ");
    const deleteThisGroup = async () => {
        if (!token) {
            return;
        }

        const response = await deleteGroup(group.id, token);

        if (response.error) {
            console.error("Failed to delete group", response);
        } else {
            updateGroupsCallback();
        }
    }

    return (
        <Card className="mb-2 p-2">
            <Row className="align-items-center">
                <Col>
                    <Card.Title>
                        <Link
                            to={`/groups/${group.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            {group.name}
                        </Link>
                    </Card.Title>
                    <Card.Text>{peopleString}</Card.Text>
                </Col>
                <Col>
                    <Button 
                        style={{float: 'right'}} 
                        variant="outline-danger"
                        onClick={deleteThisGroup}
                    >
                        Delete
                    </Button>
                </Col>
            </Row>
        </Card>
    )
}

export default GroupListItem