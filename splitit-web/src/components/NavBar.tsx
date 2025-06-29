import { Nav, Navbar } from "react-bootstrap"
import { NavLink } from "react-router-dom"

function NavBarComponent() {
    return (
        <Navbar className="bg-body-tertiary p-2">
            <Navbar.Brand as={NavLink} to="/">SplitIt</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Nav.Link className="m-3" as={NavLink} to="/groups">Groups</Nav.Link>
            <Nav.Link className="m-3" as={NavLink} to="/signin">Sign In</Nav.Link>
        </Navbar>
    )
}

export default NavBarComponent