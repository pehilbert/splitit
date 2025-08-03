import { Container } from "react-bootstrap"
import { useAuth } from "../context/Contexts"

function Home() {
    const {currentUser} = useAuth();

    return (
        <Container fluid>
            {currentUser ? 
                <h3>Hello, {currentUser.firstName}!</h3>
                :
                <h3>You are not signed in</h3>
            }
        </Container>
    )
}

export default Home