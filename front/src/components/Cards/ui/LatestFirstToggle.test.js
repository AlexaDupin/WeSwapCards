import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LatestFirstToggle from './LatestFirstToggle';

describe('LatestFirstToggle', () => {
  test('shows A–Z selected by default sorting', () => {
    render(<LatestFirstToggle checked={false} onChange={jest.fn()} />);

    expect(screen.getByRole('radio', { name: 'A–Z' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Latest' })).toHaveAttribute('aria-checked', 'false');
  });

  test('switches to latest first', () => {
    const onChange = jest.fn();
    render(<LatestFirstToggle checked={false} onChange={onChange} />);

    fireEvent.click(screen.getByRole('radio', { name: 'Latest' }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('switches back to A–Z', () => {
    const onChange = jest.fn();
    render(<LatestFirstToggle checked onChange={onChange} />);

    fireEvent.click(screen.getByRole('radio', { name: 'A–Z' }));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  test('ignores a click on the option already selected', () => {
    const onChange = jest.fn();
    render(<LatestFirstToggle checked onChange={onChange} />);

    fireEvent.click(screen.getByRole('radio', { name: 'Latest' }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
