import { Breadcrumb, Button, Col, Container, ListGroup, Row } from "react-bootstrap"
import { Link, useParams } from "react-router-dom";
import { useGroups } from "../contexts/GroupContext";
import type { Group } from "../types/model";

function ManageGroup() {
    const {groupId} = useParams<{groupId: string}>();
    const {getGroupById} = useGroups();

    const group: Group | undefined = getGroupById(groupId || "");
    
    return (
        <Container className="mt-3 ms-1">
            {group ? (
            <>
                <Breadcrumb>
                    <Breadcrumb.Item href="/groups">Groups</Breadcrumb.Item>
                    <Breadcrumb.Item active>{group.name}</Breadcrumb.Item>
                </Breadcrumb>
                <Row>
                    <Col>
                        <Row className="justify-content-between align-items-center mb-2">
                            <Col xs="auto"><h4>People</h4></Col>
                            <Col xs="auto"><Button variant="outline-secondary">+</Button></Col>
                        </Row>
                        <ListGroup>
                            {group.people.map((person, index) => (
                                <ListGroup.Item key={index}>{person.name}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                    <Col>
                        <Row className="justify-content-between align-items-center mb-2">
                            <Col xs="auto"><h4>Expenses</h4></Col>
                            <Col xs="auto"><Button variant="outline-secondary">+</Button></Col>
                        </Row>
                        <ListGroup>
                            {group.expenses.map((expense, index) => (
                                <ListGroup.Item  key={index}>
                                    <Link
                                        to={`/groups/${group.id}/${expense.id}`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        {expense.title}
                                    </Link>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>
            </>
            ) : <h1>Group not found</h1>}
        </Container>
    )
}

export default ManageGroup