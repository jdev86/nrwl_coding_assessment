import { Ticket } from '@acme/shared-models';
import { useState, useCallback } from 'react';

/* eslint-disable-next-line */
export const useTickets: any = () => {{
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [ticket, setTicket] = useState({} as Ticket);
  const [isLoading, setIsLoading] = useState(false as boolean);

  const fetchTickets = useCallback( async () => {
    setIsLoading(true);
    await fetch('/api/tickets').then(res => res.json() ).then(data =>{
        setTickets(data);
        setIsLoading(false);
    })
  }, [setTickets])

  const updateTickets = useCallback( async (description: string) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: description })
    };

    await fetch('/api/tickets', requestOptions).then(res => res.json()).then(_ => fetchTickets())
  }, [fetchTickets]);

  const fetchTicket = useCallback( async (id: number) => {
    await fetch(`/api/tickets/${id}`).then(res => res.json()).then(data => setTicket(data))
  }, [setTicket]);

  const completeTicket = useCallback(async (id: number) => {
    const requestOptions = {
      method: "PUT",
    };
    await fetch(`/api/tickets/${id}/complete`, requestOptions).then(res => {if(res.ok){ fetchTicket(id) } });
  }, [fetchTicket]);

  const assignUser = useCallback( async (id: number, userId: number) => {
    const requestOptions = {
      method: "PUT",
    };
    await fetch(`/api/tickets/${id}/assign/${userId}`, requestOptions).then(res => {if(res.ok) { fetchTicket(id)} });
  }, [fetchTicket]);

  const markTicketIncomplete = useCallback(async (id: number) => {
    const requestOptions = {
      method: "DELETE"
    };
    await fetch(`/api/tickets/${id}/complete`, requestOptions).then(res => {if(res.ok){ fetchTicket(id) } });
  }, [fetchTicket]);

  return {tickets, ticket, fetchTickets, updateTickets, fetchTicket, completeTicket, assignUser, markTicketIncomplete, setTickets, isLoading}
}};
