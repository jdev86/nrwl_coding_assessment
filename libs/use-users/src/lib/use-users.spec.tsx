import { render } from '@testing-library/react';

import UseUsers from './use-users';

describe('UseUsers', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UseUsers />);
    expect(baseElement).toBeTruthy();
  });
});
