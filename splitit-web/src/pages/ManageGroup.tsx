import { Breadcrumb, Button, Col, Container, Form, ListGroup, Modal, ProgressBar, Row, Toast, ToastContainer } from "react-bootstrap"
import 'react-circular-progressbar/dist/styles.css';
import { Link, useParams } from "react-router-dom";
import { type Expense, type ExpenseSplit, type Group, type User } from "../types/model";
import { useEffect, useState, useCallback } from "react";
import { getTotalPaid } from "../types/expenseUtility";
import { createEmptyExpense, createEmptyUser } from "../types/util";
import { addGroupMember, getGroupById, removeGroupMember } from "../data/groupRepository";
import { groupJsonToGroup, userJsonToUser } from "../data/mapping";
import { useAuth } from "../context/Contexts";
import { searchByUsername } from "../data/userRepository";

function ManageGroup() {
    const {token, currentUser} = useAuth();
    const {groupId} = useParams<{groupId: string}>();
    const [group, setGroup] = useState<Group>();
    const [loadingError, setLoadingError] = useState<string>();

    const [showAddPersonModal, setAddPersonModal] = useState<boolean>(false);
    const [searchUsername, setSearchUsername] = useState<string>('');
    const [userSearchResults, setUserSearchResults] = useState<User[] | null>([]);
    const [newGroupMember, setNewGroupMember] = useState<User>();

    const [showAddExpenseModal, setAddExpenseModal] = useState<boolean>(false);
    const [newExpense, setNewExpense] = useState<Expense>(createEmptyExpense());
    const [newSplit, setNewSplit] = useState<ExpenseSplit[]>([]);

    const [inputError, setInputError] = useState<string | null>(null);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastText, setToastText] = useState<string>('');

    const SEARCH_DEBOUNCE = 400;

    const updateGroup = useCallback(async () => {
        if (!groupId) {
            setLoadingError("Something went wrong loading this group");
            return;
        }

        if (!token || !currentUser) {
            setLoadingError("Please sign in");
            return;
        }

        getGroupById(groupId)
        .then(response => {
            if (response.groups && response.groups.length > 0) {
                setGroup(groupJsonToGroup(response.groups[0]));
            }
        });
    }, [groupId, token, currentUser]);

    useEffect(() => {
        updateGroup()
    }, [groupId, currentUser, token, showAddPersonModal, updateGroup])

    useEffect(() => {
        const trimmedSearchTerm = searchUsername.trim();

        if (!trimmedSearchTerm) {
            return;
        }

        const handler = setTimeout(() => {
            searchByUsername(trimmedSearchTerm)
                .then(response => {
                    console.log("response.users =", response.users);
                    if (response.users !== undefined) {
                        let userResults = response.users.map(json => userJsonToUser(json));
                        if (newGroupMember && !userResults.some(user => user.id === newGroupMember.id)) {
                            userResults = [newGroupMember, ...userResults];
                        }

                        setUserSearchResults(userResults);
                    } else {
                        console.log("In empty branch")
                        setUserSearchResults([]);
                    }
                })
                .catch(error => console.error("Error searching for users", error));
        }, SEARCH_DEBOUNCE);

        return () => {
            clearTimeout(handler);
        };
    }, [searchUsername, newGroupMember])

    const toastMessage = (message: string) => {
        setToastText(message);
        setShowToast(true);
    }

    const handleAddPerson = async () => {
        if (!token) {
            setInputError("Please sign in");
            return;
        }

        if (!newGroupMember) {
            setInputError("Please select a user to add to the group");
            return;
        }

        if (!group) {
            setInputError("Something went wrong");
            return;
        }

        const response = await addGroupMember(group.id, { user_id: parseInt(newGroupMember.id) }, token);

        if (response.message) {
            toastMessage(response.message);
        }

        setAddPersonModal(false);
        setNewGroupMember(undefined);
        setSearchUsername('');
        setUserSearchResults([]);
    }

    const handleAddExpense = () => {
        newExpense.id = crypto.randomUUID();
        newExpense.splits = newSplit;
        setNewExpense({...newExpense});

        if (group) {
            // TODO: call API to add expense
            toastMessage(`Expense '${newExpense.title.trim()}' added to the group`);
        } else {
            toastMessage("Something went wrong");
        }

        setNewExpense(createEmptyExpense());
        setNewSplit([]);
        setAddExpenseModal(false);
    }

    const getMemberById = (id: string): User => {
        const result = group?.members.find((user) => user.id == id);
        return result ? result : createEmptyUser();
    }

    const getSplitByUserId = (id: string): ExpenseSplit | undefined => {
        return newSplit.find((split) => split.user.id == id);
    }
    
    async function handleRemovePerson(user: User) {
        if (!group) {
            toastMessage("Something went wrong");
            return;
        }

        if (!token) {
            toastMessage("Please sign in");
            return;
        }

        const response = await removeGroupMember(group.id, { user_id: parseInt(user.id) }, token);

        if (response.message) {
            toastMessage(response.message);
        }

        updateGroup();
    }

    function handleRemoveExpense(expense: Expense): void {
        if (!group) {
            toastMessage("Something went wrong");
            return;
        }

        // TODO: call API to delete expense
        toastMessage(`Removed expense '${expense.title}'`);
    }

    if (loadingError) {
        return (
            <h3>{loadingError}</h3>
        )
    }

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
                            <Col xs="auto"><Button variant="outline-secondary" onClick={() => setAddPersonModal(true)}>+</Button></Col>
                        </Row>
                        <ListGroup>
                            {group.members.map((user, index) => (
                                <ListGroup.Item key={index}>
                                    <Row className="justify-content-between align-items-center">
                                        <Col>
                                            {user.firstName} {user.lastName}
                                        </Col>
                                        <Col>
                                            <Button 
                                                style={{float: 'right'}}
                                                variant="outline-danger"
                                                onClick={() => handleRemovePerson(user)}
                                            >
                                                Remove
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                    <Col>
                        <Row className="justify-content-between align-items-center mb-2">
                            <Col xs="auto"><h4>Expenses</h4></Col>
                            <Col xs="auto"><Button variant="outline-secondary" onClick={() => setAddExpenseModal(true)}>+</Button></Col>
                        </Row>
                        <ListGroup>
                            {group.expenses.map((expense, index) => (
                                <ListGroup.Item  key={index}>
                                    <Row className="justify-content-between align-items-center">
                                        <Col>
                                            <Link
                                                to={`/groups/${group.id}/${expense.id}`}
                                                style={{ textDecoration: 'none', color: 'inherit' }}
                                            >
                                                {expense.title} - ${getTotalPaid(expense).toFixed(2)} / ${expense.totalCost.toFixed(2)}
                                            </Link>
                                            <ProgressBar
                                                className="mt-2"
                                                now={getTotalPaid(expense) / expense.totalCost * 100}
                                                variant={getTotalPaid(expense) === expense.totalCost ? 'success' : ''}
                                            />
                                        </Col>
                                        <Col>
                                            <Button 
                                                style={{float: 'right'}}
                                                variant="outline-danger"
                                                onClick={() => handleRemoveExpense(expense)}
                                            >
                                                Remove
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>
            </>
            ) : <h1>Group not found</h1>}

            {/* Add Person modal */}
            <Modal 
                show={showAddPersonModal} 
                onHide={() => setAddPersonModal(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add Person to Group "{group?.name}"</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Control
                            type="text"
                            placeholder="Person's name"
                            value={searchUsername}
                            onChange={(e) => {
                                setSearchUsername(e.target.value);
                                setInputError(null);
                            }}
                            isInvalid={!!inputError}
                        />
                        <Form.Control.Feedback type="invalid">
                            {inputError}
                        </Form.Control.Feedback>
                        <Container>
                            {userSearchResults && userSearchResults.length > 0 ? 
                            userSearchResults.map((user, index) => (
                                <Button className="mt-1" key={index} 
                                    variant={newGroupMember?.id === user.id ? "primary" : "outline-primary"}
                                    onClick={() => {
                                        setNewGroupMember(user);
                                        setSearchUsername(user.username);
                                    }}
                                >
                                    {user.firstName} {user.lastName} | @{user.username}
                                </Button>
                            )) :
                            <p className="mt-1">No users found.</p>}
                        </Container>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setAddPersonModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleAddPerson}>Add</Button>
                </Modal.Footer>
            </Modal>

            {/* Add Expense modal */}
            <Modal 
                show={showAddExpenseModal} 
                onHide={() => setAddExpenseModal(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add Expense to Group "{group?.name}"</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="addExpense.basicInfo">
                        <Form.Label>Title</Form.Label>
                        <Form.Control 
                            type="text"
                            placeholder="Expense title"
                            value={newExpense.title}
                            onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                        />
                        <Form.Label className="mt-2">Description</Form.Label>
                        <Form.Control 
                            type="text"
                            placeholder="Expense description"
                            value={newExpense.description}
                            onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                        />
                        <Row className="mt-2">
                            <Col>
                                <Form.Label className="mt-2">Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={new Date(newExpense.date).toISOString().slice(0, 10)}
                                    onChange={(e) => setNewExpense({...newExpense, date: new Date(e.target.value)})}
                                />
                            </Col>
                            <Col>
                                <Form.Label className="mt-2">Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="$"
                                    step="0.01"
                                    min="0"
                                    value={newExpense.totalCost}
                                    onChange={(e) => setNewExpense({...newExpense, totalCost: parseFloat(e.target.value)})}
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group controlId="addExpense.payerInfo">
                        <Form.Label className="mt-3">Who paid for this?</Form.Label>
                        <Form.Select
                            value={newExpense.paidBy.id}
                            onChange={(e) => setNewExpense({...newExpense, paidBy: getMemberById(e.target.value), payerPortion: newExpense.totalCost, splits: []})}
                        >
                            <option value=''>Select...</option>
                            {group?.members.map((user, index) => (
                                <option key={index} value={user.id}>{user.firstName} {user.lastName}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    {newExpense.paidBy ? (
                        <Form.Group controlId="addExpense.splitInfo">
                            <Form.Label className="mt-3">How much does everyone owe?</Form.Label>
                            <Row className="align-items-center mt-2">
                                <Col><Form.Label>{getMemberById(newExpense.paidBy.id).firstName}</Form.Label></Col>
                                <Col>
                                    <Form.Control 
                                        type="number"
                                        placeholder="$"
                                        step="0.01"
                                        min="0"
                                        value={newExpense.payerPortion}
                                        onChange={(e) => setNewExpense({...newExpense, payerPortion: parseFloat(e.target.value)})}
                                    />
                                </Col>
                            </Row>
                            {group?.members.map((user) => {
                                const mySplit = getSplitByUserId(user.id);
                                return (
                                    user.id != newExpense.paidBy.id ? (
                                    <Row className="align-items-center mt-2">
                                        <Col className="d-flex">
                                            <Form.Check
                                                checked={mySplit ? true : false}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setNewSplit([...newSplit, {user: user, amountOwed: 0, amountPaid: 0}])
                                                    } else {
                                                        setNewSplit(newSplit.filter((split) => split.user.id != user.id))
                                                    }
                                                }}
                                            />
                                            <Form.Label className="ms-2">{getMemberById(user.id).firstName} </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control 
                                                type="number"
                                                placeholder="$"
                                                step="0.01"
                                                min="0"
                                                readOnly={mySplit ? false : true}
                                                value={mySplit?.amountOwed}
                                                onChange={(e) => {
                                                    console.log("changed")
                                                    if (mySplit) {
                                                        console.log(e.target.value)
                                                        mySplit.amountPaid = 0;
                                                        mySplit.amountOwed = parseFloat(e.target.value);
                                                        setNewSplit([...newSplit]);
                                                    }
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                ) : <></>
                            )})}
                        </Form.Group>
                    ) : <></>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setAddExpenseModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleAddExpense}>Add</Button>
                </Modal.Footer>
            </Modal>

            {/* Toast messages */}
            <ToastContainer className="p-1 m-1" position="bottom-start" style={{zIndex: 1}}>
                <Toast show={showToast} onClose={() => setShowToast(false)}>
                    <Toast.Header className="ps-0" closeButton/>
                    <Toast.Body>{toastText}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
}

export default ManageGroup