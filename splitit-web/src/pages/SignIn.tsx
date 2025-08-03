import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useAuth } from "../context/Contexts";
import { useNavigate } from "react-router-dom";

function SignIn() {
    const {authenticate} = useAuth();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [validated, setValidated] = useState<boolean>(false);
    const navigate = useNavigate();
    
    const handleSignIn = async () => {
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();
        if (!trimmedUsername || !trimmedPassword) {
            setError("Username and password cannot be blank.");
            setValidated(true);
            return;
        }

        setError("");
        setValidated(false);

        try {
            await authenticate(trimmedUsername, trimmedPassword);
            navigate("/");
        } catch (error) {
            setError(error as string);
        }
    }

    return (
        <Container className="w-25 mx-auto mt-5">
            <h3 style={{textAlign: 'center'}}>Sign In To Your Account</h3>
            <Form noValidate>
                <Form.Control
                    className="w-75 mt-4 mx-auto"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    isInvalid={validated && !username.trim()}
                />
                <Form.Control
                    className="w-75 mt-2 mx-auto"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={validated && !password.trim()}
                />
                {error && (
                    <div className="text-danger text-center mt-2">{error}</div>
                )}
                <Button 
                    variant="dark" 
                    className="w-50 mt-3 d-block mx-auto"
                    onClick={handleSignIn}
                >
                    Sign In
                </Button>
            </Form>
        </Container>
    )
}

export default SignIn;