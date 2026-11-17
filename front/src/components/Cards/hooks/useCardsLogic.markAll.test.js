import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth } from '@clerk/clerk-react';
import { axiosInstance } from '../../../helpers/axiosInstance';
import { useStateContext } from '../../../contexts/StateContext';
import useCardsLogic from './useCardsLogic';

jest.mock('@clerk/clerk-react', () => ({ useAuth: jest.fn() }));
jest.mock('../../../helpers/axiosInstance', () => ({
  axiosInstance: { get: jest.fn(), post: jest.fn() },
}));
jest.mock('../../../contexts/StateContext', () => ({ useStateContext: jest.fn() }));

let statuses;

beforeEach(() => {
  jest.clearAllMocks();
  statuses = { 1: 'default', 2: 'default' };
  useAuth.mockReturnValue({
    isLoaded: true,
    isSignedIn: true,
    getToken: jest.fn().mockResolvedValue('test-token'),
  });
  useStateContext.mockReturnValue({ explorer: { id: 123 } });
  axiosInstance.get.mockImplementation((url) => {
    if (url === '/places') return Promise.resolve({ data: { places: [] } });
    if (url === '/cards') return Promise.resolve({ data: { cards: [] } });
    if (url === '/cards/statuses/123') return Promise.resolve({ data: { statuses } });
    return Promise.reject(new Error(`unexpected ${url}`));
  });
  axiosInstance.post.mockResolvedValue({ data: { ok: true, added: 2 } });
});

describe('useCardsLogic: mark all cards as owned', () => {
  test('flags a signed-in explorer with no logged cards as new', async () => {
    const { result } = renderHook(() => useCardsLogic());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasNoCards).toBe(true);
  });

  test('does not flag an explorer who already logged a card', async () => {
    statuses = { 1: 'owned', 2: 'default' };
    const { result } = renderHook(() => useCardsLogic());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasNoCards).toBe(false);
  });

  test('posts to the all-cards endpoint, then reloads the statuses', async () => {
    const { result } = renderHook(() => useCardsLogic());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    statuses = { 1: 'owned', 2: 'owned' };
    await act(async () => {
      await result.current.markAllCardsOwned();
    });

    expect(axiosInstance.post).toHaveBeenCalledWith(
      '/explorercards/123/status',
      { status: 'owned' },
      expect.objectContaining({ headers: { Authorization: 'Bearer test-token' } }),
    );
    expect(result.current.state.cardStatuses).toEqual({ 1: 'owned', 2: 'owned' });
    expect(result.current.hasNoCards).toBe(false);
    expect(result.current.isMarkingAllOwned).toBe(false);
  });

  test('shows an error when the request fails', async () => {
    axiosInstance.post.mockRejectedValue(new Error('network'));
    const { result } = renderHook(() => useCardsLogic());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.markAllCardsOwned();
    });

    expect(result.current.state.alert.message).toBe(
      'Could not mark all cards as owned. Try again.',
    );
    expect(result.current.isMarkingAllOwned).toBe(false);
  });
});
