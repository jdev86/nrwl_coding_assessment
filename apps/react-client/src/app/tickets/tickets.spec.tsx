import { render } from '@testing-library/react';

import { Tickets } from './tickets';

describe('Tickets', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Tickets />);
    expect(baseElement).toBeTruthy();
  });
});
