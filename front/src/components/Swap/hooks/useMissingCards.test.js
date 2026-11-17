import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '@clerk/clerk-react';
import { axiosInstance } from '../../../helpers/axiosInstance';
import { useStateContext } from '../../../contexts/StateContext';
import useMissingCards from './useMissingCards';

jest.mock('@clerk/clerk-react', () => ({ useAuth: jest.fn() }));
jest.mock('../../../helpers/axiosInstance', () => ({ axiosInstance: { get: jest.fn() } }));
jest.mock('../../../contexts/StateContext', () => ({ useStateContext: jest.fn() }));

const cards = [
  { id: 1, number: 1 },
  { id: 2, number: 2 },
  { id: 3, number: 3 },
];

beforeEach(() => {
  jest.clearAllMocks();
  useAuth.mockReturnValue({
    isLoaded: true,
    isSignedIn: true,
    getToken: jest.fn().mockResolvedValue('test-token'),
  });
  useStateContext.mockReturnValue({ explorer: { id: 123 } });
  axiosInstance.get.mockResolvedValue({
    data: { statuses: { 1: 'owned', 2: 'duplicated' } },
  });
});

describe('useMissingCards', () => {
  test('returns the cards that are neither owned nor duplicated', async () => {
    const { result } = renderHook(() => useMissingCards(cards));

    await waitFor(() => expect(result.current.has(3)).toBe(true));
    expect(result.current.has(1)).toBe(false);
    expect(result.current.has(2)).toBe(false);
    expect(axiosInstance.get).toHaveBeenCalledWith('/cards/statuses/123', {
      headers: { Authorization: 'Bearer test-token' },
    });
  });

  test('reports nothing missing and skips the request when signed out', async () => {
    useAuth.mockReturnValue({ isLoaded: true, isSignedIn: false, getToken: jest.fn() });

    const { result } = renderHook(() => useMissingCards(cards));

    expect(result.current.size).toBe(0);
    expect(axiosInstance.get).not.toHaveBeenCalled();
  });

  test('reports nothing missing when the request fails', async () => {
    axiosInstance.get.mockRejectedValue(new Error('network'));

    const { result } = renderHook(() => useMissingCards(cards));

    await waitFor(() => expect(axiosInstance.get).toHaveBeenCalled());
    expect(result.current.size).toBe(0);
  });
});
