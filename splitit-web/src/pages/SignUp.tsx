import { useState } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/Contexts";
import { useNavigate, Link } from "react-router-dom";
import { createNewUser } from "../data/userRepository";

function SignUp() {
    const { authenticate } = useAuth();
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [validated, setValidated] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSignUp = async () => {
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();

        if (
            !trimmedFirstName ||
            !trimmedLastName ||
            !trimmedUsername ||
            !trimmedPassword ||
            !trimmedConfirmPassword
        ) {
            setError("All fields are required.");
            setValidated(true);
            return;
        }

        if (trimmedPassword !== trimmedConfirmPassword) {
            setError("Passwords do not match.");
            setValidated(true);
            return;
        }

        setError("");
        setValidated(false);

        try {
            const response = await createNewUser({
                username: trimmedUsername,
                password: trimmedPassword,
                first_name: trimmedFirstName,
                last_name: trimmedLastName,
            });

            if (!response.user) {
                setError(response.message || "Something went wrong. Please try again.");
                return;
            }

            // Authenticate and navigate to home
            await authenticate(trimmedUsername, trimmedPassword);
            navigate("/");
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error(err);
        }
    };

    return (
        <Container className="w-25 mx-auto mt-5">
            <h3 style={{ textAlign: 'center' }}>Create An Account</h3>
            <Form noValidate>
                <Row className="gx-1 w-75 mt-4 mx-auto">
                    <Col xs={6}>
                        <Form.Control
                            className="w-100"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            isInvalid={validated && !firstName.trim()}
                        />
                    </Col>
                    <Col xs={6}>
                        <Form.Control
                            className="w-100"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            isInvalid={validated && !lastName.trim()}
                        />
                    </Col>
                </Row>
                <Form.Control
                    className="w-75 mt-2 mx-auto"
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
                <Form.Control
                    className="w-75 mt-2 mx-auto"
                    placeholder="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    isInvalid={validated && (!confirmPassword.trim() || password !== confirmPassword)}
                />
                {error && (
                    <div className="text-danger text-center mt-2">{error}</div>
                )}
                <Button
                    variant="dark"
                    className="w-50 mt-3 d-block mx-auto"
                    onClick={handleSignUp}
                >
                    Sign Up
                </Button>
                <div className="text-center mt-3">
                    <p>Have an account? <Link to="/signin">Sign in</Link></p>
                </div>
            </Form>
        </Container>
    );
}

export default SignUp;