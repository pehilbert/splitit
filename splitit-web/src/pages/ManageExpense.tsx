import { Breadcrumb, Card, Col, Container, ListGroup, Row } from "react-bootstrap"
import { useGroups } from "../contexts/GroupContext"
import { useParams } from "react-router-dom"
import type { Expense, Group, Person } from "../types/model"

function ManageExpense() {
    const {groupId, expenseId} = useParams<{groupId: string, expenseId: string}>();
    const {getGroupById} = useGroups();

    const group: Group | undefined = getGroupById(groupId || "");
    const expense: Expense | undefined = group?.expenses.find((expense) => expense.id == expenseId);

    function getPersonById(personId: string): Person {
        const person = group?.people.find((person) => person.id == personId);

        return person ? person : {id: "", name: ""};
    }

    return (
        <Container className="mt-3 ms-1">
            {group && expense ? (
            <>
                <Breadcrumb>
                    <Breadcrumb.Item href="/groups">Groups</Breadcrumb.Item>
                    <Breadcrumb.Item href={`/groups/${groupId}`}>{group.name}</Breadcrumb.Item>
                    <Breadcrumb.Item active>{expense.title}</Breadcrumb.Item>
                </Breadcrumb>
                <Row>
                    <Col className="p-2 w-25">
                        <Card className="p-2">
                            <Row className="justify-content-between">
                                <Col xs="auto">
                                    <h5>{expense.title}</h5>
                                    <p>{expense.description}</p>
                                </Col>
                                <Col xs="auto">
                                    <h5>{new Date(expense.date).toLocaleDateString('en-US')}</h5>
                                </Col>
                            </Row>
                            <Row>
                                <p>${expense.totalCost.toFixed(2)}</p>
                                <p>Paid by: {getPersonById(expense.paidById).name}</p>
                            </Row>
                        </Card>
                    </Col>
                    <Col className="p-2">
                        <h5>Split</h5>
                        <ListGroup>
                            <ListGroup.Item>{getPersonById(expense.paidById).name} paid | Portion: ${expense.payerPortionAmount.toFixed(2)}</ListGroup.Item>
                            {expense.splitBetween.map((split, index) => {
                                const person = getPersonById(split.personId);

                                return (
                                    <ListGroup.Item key={index}>
                                        {person.name}, owes ${split.amountOwed.toFixed(2)} | Portion: ${split.portionAmount.toFixed(2)}
                                    </ListGroup.Item>
                                )
                            })}
                        </ListGroup>
                    </Col>
                </Row>
            </>
            ) : <h1>Expense not found</h1>}
        </Container>
    )
}

export default ManageExpense