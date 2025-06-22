import { Breadcrumb, Card, Col, Container, FormControl, ListGroup, ProgressBar, Row } from "react-bootstrap"
import { useGroups } from "../context/GroupContext"
import { useParams } from "react-router-dom"
import { type Expense, type Group, type Person } from "../types/model"
import { useState } from "react";
import { getTotalPaid } from "../types/expenseUtility";

function ManageExpense() {
    const [currentlyEditingSplit, setCurrentlyEditingSplit] = useState<string>('');
    const [currentlyEditingSplitAmount, setCurrentlyEditingSplitAmount] = useState<number>(0);

    const {groupId, expenseId} = useParams<{groupId: string, expenseId: string}>();
    const {getGroupById, updateGroup} = useGroups();

    const group: Group | undefined = getGroupById(groupId || "");
    const expense: Expense | undefined = group?.expenses.find((expense) => expense.id == expenseId);

    function getPersonById(personId: string): Person {
        const person = group?.people.find((person) => person.id == personId);

        return person ? person : {id: "", name: ""};
    }

    function handleChangeEditingSplit(personId: string) {
        const prevSplit = expense?.splitBetween.find(split => split.personId === currentlyEditingSplit);

        if (prevSplit) {
            prevSplit.amountPaid = Math.min(currentlyEditingSplitAmount, prevSplit.amountOwed);
            updateGroup(group!);
        }

        const currentSplit = expense?.splitBetween.find(split => split.personId === personId);

        if (currentSplit) {
            setCurrentlyEditingSplit(personId);
            setCurrentlyEditingSplitAmount(currentSplit.amountPaid);
        } else {
            setCurrentlyEditingSplit('');
            setCurrentlyEditingSplitAmount(0);
        }
    }

    return (
        <Container className="w-100 mt-3 ms-1">
            {group && expense ? (
            <>
                <Breadcrumb>
                    <Breadcrumb.Item href="/groups">Groups</Breadcrumb.Item>
                    <Breadcrumb.Item href={`/groups/${groupId}`}>{group.name}</Breadcrumb.Item>
                    <Breadcrumb.Item active>{expense.title}</Breadcrumb.Item>
                </Breadcrumb>
                <Row>
                    <Col className="p-2 w-25">
                        <Container className="p-1 d-flex justify-content-between">
                            <h5>Expense Summary</h5>
                        </Container>
                        <Card className="p-2">
                            <Row className="justify-content-between">
                                <Col className="px-3" xs="auto">
                                    <h5>{expense.title}</h5>
                                    <p>{expense.description}</p>
                                </Col>
                                <Col className="px-3" xs="auto">
                                    <h5>{new Date(expense.date).toLocaleDateString('en-US')}</h5>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="px-3">
                                    <p>Paid by: {getPersonById(expense.paidById).name}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="px-3">
                                    <h5>${getTotalPaid(expense).toFixed(2)} / ${expense.totalCost.toFixed(2)}</h5>
                                    <ProgressBar
                                        now={getTotalPaid(expense) / expense.totalCost * 100}
                                        variant={getTotalPaid(expense) === expense.totalCost ? 'success' : ''}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col className="p-2 w-25">
                        <Container className="p-1 d-flex justify-content-between">
                            <h5>Split</h5>
                        </Container>
                        <ListGroup>
                            <ListGroup.Item className="d-flex justify-content-between p-2">
                                <p>{getPersonById(expense.paidById).name}</p>
                                <p>${expense.payerPortionAmount.toFixed(2)}</p>
                            </ListGroup.Item>
                            {expense.splitBetween.map((split, index) => {
                                const person = getPersonById(split.personId);

                                return (
                                    <ListGroup.Item className="d-flex justify-content-between p-2" key={index}>
                                        <p>{person.name}</p>
                                        <div style={{width: '25%'}}>
                                            {currentlyEditingSplit === split.personId ?
                                            <>
                                                <FormControl
                                                    type="number"
                                                    placeholder="$"
                                                    step="0.01"
                                                    min="0"
                                                    value={currentlyEditingSplitAmount}
                                                    onChange={(e) => setCurrentlyEditingSplitAmount(parseFloat(e.target.value))}
                                                    onBlur={() => handleChangeEditingSplit('')}
                                                />
                                                / ${split.amountOwed.toFixed(2)}
                                            </>
                                            : 
                                            <>
                                                <p 
                                                    style={{textAlign: 'right'}} 
                                                    onClick={() => handleChangeEditingSplit(split.personId)}
                                                >
                                                    ${split.amountPaid.toFixed(2)} / ${split.amountOwed.toFixed(2)}
                                                </p>
                                                <ProgressBar 
                                                    now={split.amountPaid / split.amountOwed * 100} 
                                                    variant={split.amountPaid === split.amountOwed ? 'success' : ''}
                                                />
                                            </>}
                                        </div>
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