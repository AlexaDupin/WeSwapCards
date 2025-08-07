import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SwapCard from './SwapCard';
import mockSwapLogic from './mocks';

jest.mock('../hooks/useSwapLogic', () => () => mockSwapLogic);

describe('SwapCard', () => {
    test('renders swap title and explorer name', () => {
      render(<SwapCard />);
  
      expect(screen.getByText('Find a card')).toBeInTheDocument();
      expect(screen.getByText('Select a chapter, Alex')).toBeInTheDocument();
      expect(screen.getByText('User One')).toBeInTheDocument();
      expect(screen.getByText('Contact this user to swap')).toBeInTheDocument();
    });
  
    test('renders card selection list', () => {
      render(<SwapCard />);
      expect(screen.getByText('Click on the card you are looking for!')).toBeInTheDocument();
      expect(screen.getByText('Card A')).toBeInTheDocument(); // From the card preview mock
    });
  
    test('calls handleContactButton when clicking contact button', () => {
      render(<SwapCard />);
  
      const contactButton = screen.getByText('Contact this user to swap');
      fireEvent.click(contactButton);
  
      expect(mockSwapLogic.handleContactButton).toHaveBeenCalledWith(
        'u1', // explorer_id
        'User One', // explorer_name
        [{ card: { id: 20, name: 'Card B' } }] // opportunities
      );
    });
  
    test('displays swap card name in title', () => {
      render(<SwapCard />);
      expect(screen.getByText(/Here are the users who can give you this card/i)).toBeInTheDocument();
      expect(screen.getByText('Card A')).toBeInTheDocument();
    });
  });