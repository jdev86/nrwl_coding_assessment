import { render } from '@testing-library/react';
import {BrowserRouter as Router} from 'react-router-dom';

import { Tickets } from './tickets';
import { useTickets } from "@acme/use-tickets";

jest.mock("@acme/use-tickets");

describe('Tickets', () => {
  it('should render successfully', () => {
    useTickets.mockReturnValue(
      {
        fetchTickets: jest.fn(),
        ticket: {},
        fetchTicket: jest.fn(), 
        completeTicket: jest.fn(), 
        assignUser: jest.fn(), 
        markTicketIncomplete: jest.fn()
      }
    )
    const { baseElement } = render(<Router><Tickets /></Router>);
    expect(baseElement).toBeTruthy();
  });
});
