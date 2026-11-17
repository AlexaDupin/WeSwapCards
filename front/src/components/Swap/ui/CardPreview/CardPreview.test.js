import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CardPreview from './CardPreview';

const card = { id: 9, number: 9, name: 'Cosmic 9' };

describe('CardPreview', () => {
  test('shows no lock on an owned card', () => {
    render(<CardPreview card={card} fetchSwapOpportunities={jest.fn()} isSelected={false} />);

    expect(screen.getByRole('button', { name: '9' })).toBeInTheDocument();
    expect(screen.queryByTestId('card-lock-9')).not.toBeInTheDocument();
  });

  test('shows a lock and a missing label on a missing card', () => {
    render(<CardPreview card={card} fetchSwapOpportunities={jest.fn()} isSelected={false} isMissing />);

    expect(screen.getByRole('button', { name: '9, missing' })).toBeInTheDocument();
    expect(screen.getByTestId('card-lock-9')).toBeInTheDocument();
  });

  test('keeps the lock on a selected missing card and still selects it', () => {
    const fetchSwapOpportunities = jest.fn();
    render(<CardPreview card={card} fetchSwapOpportunities={fetchSwapOpportunities} isSelected isMissing />);

    const button = screen.getByRole('button', { name: '9, missing' });
    expect(button).toHaveClass('swap-card-square-selected');
    expect(screen.getByTestId('card-lock-9')).toBeInTheDocument();

    fireEvent.click(button);
    expect(fetchSwapOpportunities).toHaveBeenCalledWith(9);
  });
});
