import { Breadcrumb, Card, Col, Container, FormControl, ListGroup, ProgressBar, Row } from "react-bootstrap"
import { Link } from "react-router-dom";
import { useAuth } from '../context/Contexts';
import { useParams } from "react-router-dom"
import { type Expense, type Group } from "../types/model"
import { useCallback, useEffect, useState } from "react";
import { getTotalPaid } from "../types/expenseUtility";
import { getGroupById } from "../data/groupRepository";
import { expenseJsonToExpense, groupJsonToGroup } from "../data/mapping";
import { updateExpense, type UpdateExpenseRequest } from "../data/expenseRepository";

function ManageExpense() {
    const {token, currentUser} = useAuth();
    const [currentlyEditingSplit, setCurrentlyEditingSplit] = useState<string>('');
    const [currentlyEditingSplitAmount, setCurrentlyEditingSplitAmount] = useState<number>(0);

    const {groupId, expenseId} = useParams<{groupId: string, expenseId: string}>();

    const [group, setGroup] = useState<Group>();
    const [expense, setExpense] = useState<Expense>();
    const [loadingError, setLoadingError] = useState<string | null>(null);

    const updateGroup = useCallback (async () => {
        if (!groupId) {
            setLoadingError("Something went wrong");
            return;
        }

        const response = await getGroupById(groupId);

        if (!response.groups) {
            console.error(response);
            setLoadingError(response.message || "Something went wrong");
            return;
        }

        if (response.groups.length === 0) {
            setLoadingError("Group not found");
            return;
        }

        const group = response.groups[0];
        const expense = group.expenses.find(expense => expense.id.toString() === expenseId)
        if (!expense) {
            setLoadingError("Expense not found");
            return;
        }

        setGroup(groupJsonToGroup(group));
        setExpense(expenseJsonToExpense(expense));
    }, [groupId, expenseId]);

    useEffect(() => {
        updateGroup()
    }, [groupId, expenseId, updateGroup]);

    async function handleChangeEditingSplit(userId: string) {
        if (!expense) {
            console.error("Failed to update expense: expense does not exist");
            return;
        }

        if (!token) {
            console.error("Not signed in");
            return;
        }

        if (currentlyEditingSplit) {
            const request: UpdateExpenseRequest = {
                splits: [
                    {
                        user_id: parseInt(currentlyEditingSplit), 
                        amount_paid: currentlyEditingSplitAmount
                    }
                ]
            }

            const response = await updateExpense(expense.id, request, token);

            if (!response.expense) {
                console.error("Could not update expense", response);
            }

            updateGroup();
        }

        setCurrentlyEditingSplit(userId);
        setCurrentlyEditingSplitAmount(userId ? expense.splits.find(split => split.user.id === userId)?.amountOwed || 0 : 0);
    }

    if (loadingError) {
        return (
            <h3>{loadingError}</h3>
        )
    }

    if (!token || !currentUser) {
        return (
            <h3>Please sign in</h3>
        )
    }

    return (
        <Container className="w-100 mt-3 ms-1">
            {group && expense ? (
            <>
                <Breadcrumb>
                    <li className="breadcrumb-item">
                        <Link to="/groups">Groups</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to={`/groups/${group.id}`}>{group.name}</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        {expense.title}
                    </li>
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
                                    <p>Paid by: {expense.paidBy.firstName} {expense.paidBy.lastName}</p>
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
                                <p>{expense.paidBy.firstName} {expense.paidBy.lastName} (Creator)</p>
                                <p>${expense.payerPortion.toFixed(2)}</p>
                            </ListGroup.Item>
                            {expense.splits.sort((a, b) => parseInt(a.user.id) - parseInt(b.user.id)).map((split, index) => {
                                return (
                                    <ListGroup.Item className="d-flex justify-content-between p-2" key={index}>
                                        <p>{split.user.firstName} {split.user.lastName}</p>
                                        <div style={{width: '25%'}}>
                                            {currentlyEditingSplit === split.user.id ?
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
                                                    onClick={() => handleChangeEditingSplit(split.user.id)}
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
    );
}

export default ManageExpense