import { Breadcrumb, Container, ListGroup } from "react-bootstrap";
import GroupListItem from "../components/GroupListItem";
import { useGroups } from "../contexts/GroupContext";

function Groups() {
    const { groups } = useGroups();
    
    return (
        <Container className="mt-3 ms-1">
            <Breadcrumb>
                <Breadcrumb.Item active>Groups</Breadcrumb.Item>
            </Breadcrumb>
            <ListGroup>
                {groups.map((group, index) => (
                    <ListGroup.Item as={GroupListItem} key={index} group={group} />
                ))}
            </ListGroup>
        </Container>
    )
}

export default Groups