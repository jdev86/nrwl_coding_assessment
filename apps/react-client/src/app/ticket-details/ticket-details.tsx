import { useEffect, memo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTickets } from "@acme/use-tickets";
import { useUsers } from "@acme/use-users";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";

const TicketDetails = memo(() => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { ticket, fetchTicket, completeTicket, assignUser, markTicketIncomplete } = useTickets();
    const { users, fetchUsers } = useUsers();

    const { id }: any = state;

    useEffect(() => {
        fetchTicket(id);
        fetchUsers();
    }, [fetchTicket, fetchUsers]);

    const handleNavigateToList = useCallback(() => {
        navigate(`/`, {
            replace:true,
            })
    }, []);

    return (
        <>
            <Button onClick={handleNavigateToList} variant="secondary" size="sm">Back to Tickets</Button>
            <Card>
                <Card.Header>Status: {ticket.completed ? 'Completed' : 'Open'}</Card.Header>
                <Card.Body>
                    <Card.Title>Ticket: {ticket.id} - Assigned To: {users.find(u => u.id === ticket.assigneeId)?.name}</Card.Title>
                    <Card.Text>
                        {ticket.description}
                    </Card.Text>
                    <ButtonGroup>
                        <Dropdown className="mr-1">
                            <Dropdown.Toggle data-testid="test-assign-user-id" variant="success" id="dropdown-basic">
                                Assign Technician
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {users ? 
                                    users.filter(
                                        u => u.id !== ticket.assigneeId
                                        ).map(
                                            u => (    
                                        <Dropdown.Item data-testid={`test-dropdown-item-${u.id}`} key={u.id} onClick={() => assignUser(ticket.id, u.id)}>{u.id} - {u.name}</Dropdown.Item>
                                    )) : null
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                        {ticket?.completed ? 
                            <Button data-testid="incompleted-button" variant="primary" onClick={() => markTicketIncomplete(id)}>Mark Incomplete</Button> : 
                            <Button data-testid="completed-button" variant="primary" onClick={() => completeTicket(id)}>Mark Completed</Button>
                        }
                    </ButtonGroup>
                </Card.Body>
            </Card>
        </>
    )
})

export default TicketDetails;