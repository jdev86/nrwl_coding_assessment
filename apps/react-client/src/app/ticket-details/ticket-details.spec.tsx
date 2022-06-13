import { fireEvent, render, waitFor } from '@testing-library/react';
import {BrowserRouter as Router} from 'react-router-dom';

import TicketDetails from './ticket-details';

const mockAssignUser = jest.fn();
const mockUpdateStatus = jest.fn();
const mockFetchTickets = jest.fn();
const mockFetchTicket = jest.fn();
const mockFetchUsers = jest.fn();

const mockTicket = {"id":1,"description":"Test","assigneeId":1,"completed":false};
const mockTicket2 = {"id":2,"description":"Test-2","assigneeId":1,"completed":false};
const mockTickets = [mockTicket, mockTicket2];

jest.mock("react-router-dom", () => {
  return {
    ...jest.requireActual("react-router-dom"),
    useLocation: () => {
      return {
        pathname: '/my-custom-path/name/mocked/hey',
        search: '',
        hash: '',
        state: { id: 1 },
        key: 'default'
      }
    }
  };
});

jest.mock("@acme/use-tickets", () => ({
  useTickets: () => ({
    tickets: mockTickets,
    fetchTickets: mockFetchTickets,
    ticket: mockTicket,
    fetchTicket: mockFetchTicket, 
    completeTicket: mockUpdateStatus, 
    assignUser: mockAssignUser, 
    markTicketIncomplete: mockUpdateStatus
  })
}));
jest.mock("@acme/use-users", () => ({
  useUsers: () => ({
    fetchUsers: mockFetchUsers,
    users: [{"id":1,"name":"User1"},{"id":2,"name":"User2"}]
  })
}));

describe('TicketDetails', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.resetAllMocks();
  });
  
  it('should render successfully', () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockTicket }))
    const { getByText } = render(<Router><TicketDetails /></Router>);
    const ticket = getByText('Test');
    expect(ticket).toBeInTheDocument();
  });
  it('should fire event to change ticket status', () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: {"id":1,"description":"Install a monitor arm","assigneeId":1,"completed":false} }))

    const { getByTestId } = render(<Router><TicketDetails /></Router>);

    const completedButton = getByTestId('completed-button');

    fireEvent.click(completedButton);

    expect(mockUpdateStatus).toHaveBeenCalledTimes(1);
  });
  it('should fire event to assign ticket', async () => {

    fetchMock.mockResponseOnce(JSON.stringify({ data: mockTicket }))

    const { getByTestId } = render(<Router><TicketDetails /></Router>);

    const assignUserDropdown = getByTestId("test-assign-user-id");

    // Needed to use waitFor as the dom was updated when the dropdown opened
    await waitFor(() => {
      fireEvent.click(assignUserDropdown);
    })

    // Finding user 2 because user 1 is assigned to existing ticket and filtered from list
    const user2 = getByTestId("test-dropdown-item-2");

    fireEvent.click(user2);

    expect(mockAssignUser).toHaveBeenCalledTimes(1);
  });

});
