import { Ticket } from '@acme/shared-models';
import { useState, useCallback } from 'react';

export const useTickets: any = () => {
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [ticket, setTicket] = useState({} as Ticket);
  const [isLoading, setIsLoading] = useState(false as boolean);

  const fetchTickets = useCallback( async () => {
    try {
      setIsLoading(true);
      await fetch('/api/tickets').then(res => res.json() ).then(data =>{
        console.log(data);
          setTickets(data);
          setIsLoading(false);
      })
    } catch(e) {
      console.error(e);
    }

  }, [setTickets])

  const updateTickets = useCallback( async (description: string) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: description })
    };

    try {
      await fetch('/api/tickets', requestOptions).then(res => res.json()).then(_ => fetchTickets())
    } catch(e) {
      console.error(e);
    }

  }, [fetchTickets]);

  const fetchTicket = useCallback( async (id: number) => {
    try {
    await fetch(`/api/tickets/${id}`).then(res => res.json()).then(data => setTicket(data))
    } catch(e) {
      console.error(e);
    }
  }, [setTicket]);

  const completeTicket = useCallback(async (id: number) => {
    const requestOptions = {
      method: "PUT",
    };
    try {
      await fetch(`/api/tickets/${id}/complete`, requestOptions).then(res => {if(res.ok){ fetchTicket(id) } });
    } catch(e) {
      console.error(e);
    }
  }, [fetchTicket]);

  const assignUser = useCallback( async (id: number, userId: number) => {
    const requestOptions = {
      method: "PUT",
    };
    try {
      await fetch(`/api/tickets/${id}/assign/${userId}`, requestOptions).then(res => {if(res.ok) { fetchTicket(id)} });
    } catch(e) {
      console.error(e)
    }
  }, [fetchTicket]);

  const markTicketIncomplete = useCallback(async (id: number) => {
    const requestOptions = {
      method: "DELETE"
    };
    try {
      await fetch(`/api/tickets/${id}/complete`, requestOptions).then(res => {if(res.ok){ fetchTicket(id) } });
    } catch(e) {
      console.error(e);
    }
  }, [fetchTicket]);

  return {tickets, ticket, fetchTickets, updateTickets, fetchTicket, completeTicket, assignUser, markTicketIncomplete, setTickets, isLoading}
};
