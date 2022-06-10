import { render } from '@testing-library/react';

import UseTickets from './use-tickets';

describe('UseTickets', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UseTickets />);
    expect(baseElement).toBeTruthy();
  });
});
