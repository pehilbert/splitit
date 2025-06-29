import { Card } from "react-bootstrap"
import type { Group } from "../types/model"
import { Link } from "react-router-dom";

function GroupListItem({ group } : {group: Group}) {
    const peopleString: string = group.people.map((person => person.name)).join(", ");

    return (
        <Card className="mb-2 p-2">
            <Card.Title>
                <Link
                    to={`/groups/${group.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                >
                    {group.name}
                </Link>
            </Card.Title>
            <Card.Text>{peopleString}</Card.Text>
        </Card>
    )
}

export default GroupListItem