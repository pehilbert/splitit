import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useUserContext } from "../context/Contexts";
import { createEmptyPerson } from "../types/model";

function SignIn() {
    const {currentUser, updateCurrentUser} = useUserContext();
    const [name, setName] = useState<string | undefined>(currentUser?.name);

    function handleUpdateUser() {
        if (name && name.trim().length !== 0) {
            const trimmedName = name.trim();
            console.log("Updating current user:", trimmedName);

            if (currentUser) {
                updateCurrentUser({...currentUser, name: trimmedName})
            } else {
                const newPerson = createEmptyPerson();
                newPerson.name = trimmedName;
                updateCurrentUser(newPerson);
            }
        }
    }
    
    return (
        <Container className="w-25 mx-auto mt-5">
            <h3 style={{textAlign: 'center'}}>Sign In</h3>
            <Form.Label className="mt-3">Name</Form.Label>
            <Form.Control
                placeholder="What's your name?"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Button 
                variant="dark" 
                className="w-75 mt-3 d-block mx-auto"
                onClick={handleUpdateUser}
            >
                Update User
            </Button>
        </Container>
    )
}

export default SignIn;