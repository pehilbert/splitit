import { Button, Card, Col, Row } from "react-bootstrap"
import type { Group } from "../types/model"
import { Link } from "react-router-dom";
import { useGroups } from "../context/Contexts";

function GroupListItem({ group } : {group: Group}) {
    const peopleString: string = group.people.map((person => person.name)).join(", ");
    const {removeGroup} = useGroups();

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
                        onClick={() => removeGroup(group.id)}
                    >
                        Delete
                    </Button>
                </Col>
            </Row>
        </Card>
    )
}

export default GroupListItem