import { Ticket } from '@acme/shared-models';
import styles from './tickets.module.css';
import { useNavigate } from 'react-router-dom';
import React, { memo, useCallback, useEffect, useReducer, useState } from 'react';
import { useTickets } from '@acme/use-tickets';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Spinner from 'react-bootstrap/Spinner';

export interface TicketsProps {
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
}

interface FormState {
  isLoading?: boolean;
  description?: string;
}

interface FormAction {
  name: string;
  value: string;
}

const addTicketFormReducer = (state: FormState, action: FormAction) => {
  return {
    ...state,
    [action.name]: action.value
  }
}

export const Tickets = memo(() => {
  const [state, dispatch] = useReducer(addTicketFormReducer, {});
  const {tickets, fetchTickets, updateTickets, isLoading} = useTickets();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const [filteredTickets, setFilteredTickets] = useState([]);

  useEffect(() => {
    if(fetchTickets) {
      fetchTickets();
    }
  }, [fetchTickets]);

  useEffect(() => {
    setFilteredTickets(tickets);
  }, [tickets]);
  
  const navigateToDetails = useCallback((id: number) => 
      navigate(`/${id}`, {
        replace:true,
        state: { 
             id: id
            }
        }), []);

  const handleAddTicket = useCallback( async (event: any) => {
    event.preventDefault();
    updateTickets(state.description);
  }, [state, updateTickets]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
    {
      name: event.target['name'],
      value: event.target['value'],
    });
  }

  const filterTicketsByStatus = useCallback(async (completed: boolean) => {
    const filteredTickets = tickets.filter((t: { completed: boolean; }) => t.completed === completed)
    setFilteredTickets(filteredTickets);
  }, [tickets]);

  return (
    <div className={styles['tickets']}>
      <div style={{display: "block"}}>
        <h2>Tickets</h2>
        <div style={{alignSelf: "center"}}>
          <Button onClick={() => setIsAdding(true)}>Add Ticket</Button>
        </div>
        {
          isAdding ? 
          <Form onSubmit={handleAddTicket}>
            <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Label>Description:</Form.Label>
            <Form.Control type="input" name="description" placeholder="Enter a new ticket description" onChange={handleChange} />
            </Form.Group>

            <Button variant="primary" type="submit">Save</Button>
          </Form>:
          null
        }

      </div>
      {filteredTickets && !isLoading ? (
        <>
        <ButtonGroup className='mt-1'>
          <Button className="pt-1" onClick={() => setFilteredTickets(tickets)}>All</Button>
          <Button className="pt-1" onClick={() => filterTicketsByStatus(true)}>Completed</Button>
          <Button className="pt-1" onClick={() => filterTicketsByStatus(false)}>Incomplete</Button>
        </ButtonGroup>
        <ListGroup>
          {filteredTickets.map((t: {id: number, description: string, completed: string, assigneeId: string}) => (
          <ListGroup.Item variant={t.completed ? 'success' : 'light'} onClick={_ => navigateToDetails(t.id)} onKeyUp={e => navigateToDetails} key={t.id} style={{listStyle: "none", margin: "1rem", padding: "1rem", borderColor: "#ffff", borderRadius: ".5rem", listStylePosition: "inside",
            border: "1px solid black"}}>
            Ticket: {t.id}: <br/> {t.description}
          </ListGroup.Item>
        ))}
        </ListGroup>
        </>
      ) : (
        <Spinner className="mt-2" animation="border" />
      )}
    </div>
  );
})