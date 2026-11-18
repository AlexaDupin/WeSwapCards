import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NewCollectorBanner from './NewCollectorBanner';
import MarkAllOwnedModal from './MarkAllOwnedModal';

describe('NewCollectorBanner', () => {
  test('explains the flow, duplicates included, and opens the action', () => {
    const onMarkAllCardsOwned = jest.fn();
    render(<NewCollectorBanner onMarkAllCardsOwned={onMarkAllCardsOwned} />);

    expect(screen.getByText(/remove the ones you’re missing/)).toBeInTheDocument();
    expect(screen.getByText(/tap your duplicates again/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Mark all as owned' }));
    expect(onMarkAllCardsOwned).toHaveBeenCalledTimes(1);
  });
});

describe('MarkAllOwnedModal', () => {
  test('shows the card count, mentions duplicates, and confirms', () => {
    const onConfirm = jest.fn();
    const onHide = jest.fn();
    render(
      <MarkAllOwnedModal show cardCount={412} onConfirm={onConfirm} onHide={onHide} />,
    );

    expect(screen.getByRole('heading', { name: 'Mark ALL cards as owned?' })).toBeInTheDocument();
    expect(screen.getByText('ALL')).toHaveClass('mark-all-modal__emphasis');
    expect(screen.getByText('All 412 cards').tagName).toBe('STRONG');
    expect(screen.getByText(/in every chapter will be marked as owned/)).toBeInTheDocument();
    expect(screen.getByText(/including your duplicates, stay as they are/)).toBeInTheDocument();
    expect(
      screen.getByText('Remember, you will still need to check all your cards:'),
    ).toBeInTheDocument();
    expect(screen.getByText('Remove the ones you’re missing')).toBeInTheDocument();
    expect(screen.getByText('Tap your duplicates again to mark them')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Mark all as owned' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onHide).toHaveBeenCalledTimes(1);
  });

  test('locks the buttons while the request is running', () => {
    render(
      <MarkAllOwnedModal show pending cardCount={10} onConfirm={jest.fn()} onHide={jest.fn()} />,
    );

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Marking/ })).toBeDisabled();
  });
});
