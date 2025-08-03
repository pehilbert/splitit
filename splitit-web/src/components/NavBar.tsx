import { Nav, Navbar } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useAuth } from "../context/Contexts"

function NavBarComponent() {
    const {token, logOut} = useAuth();

    return (
        <Navbar className="bg-body-tertiary p-2">
            <Navbar.Brand as={NavLink} to="/">SplitIt</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Nav.Link className="m-3" as={NavLink} to="/groups">Groups</Nav.Link>
            {token ? 
                <Nav.Link className="m-3" as={NavLink} onClick={logOut} to="/signin">Sign Out</Nav.Link>
                :
                <Nav.Link className="m-3" as={NavLink} to="/signin">Sign In</Nav.Link>
            }
        </Navbar>
    )
}

export default NavBarComponent