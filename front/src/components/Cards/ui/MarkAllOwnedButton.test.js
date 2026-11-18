import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MarkAllOwnedButton from './MarkAllOwnedButton';

describe('MarkAllOwnedButton', () => {
  test('opens the confirmation on click', () => {
    const onClick = jest.fn();
    render(<MarkAllOwnedButton onClick={onClick} />);

    fireEvent.click(screen.getByRole('button', { name: 'Mark all cards as owned' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('does nothing while disabled', () => {
    const onClick = jest.fn();
    render(<MarkAllOwnedButton onClick={onClick} disabled />);

    const button = screen.getByRole('button', { name: 'Mark all cards as owned' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
