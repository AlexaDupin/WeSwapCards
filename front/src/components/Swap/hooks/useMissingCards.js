import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { axiosInstance } from '../../../helpers/axiosInstance';
import { useStateContext } from '../../../contexts/StateContext';

const EMPTY = new Set();

// Ids of the given cards the signed-in explorer does not own yet.
// While the statuses are unknown (signed out, still loading, or the request
// failed) no card is reported as missing, so the grid looks as it did before.
const useMissingCards = (cards) => {
  const { explorer } = useStateContext();
  const explorerId = explorer?.id;
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const [statuses, setStatuses] = useState(null);

  useEffect(() => {
    if (!isLoaded) return undefined;

    if (!isSignedIn || !explorerId) {
      setStatuses(null);
      return undefined;
    }

    let active = true;
    (async () => {
      try {
        const token = await getToken();
        const response = await axiosInstance.get(`/cards/statuses/${explorerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (active) setStatuses(response.data?.statuses ?? {});
      } catch {
        // Keep the last known statuses: a failed request should not make
        // every card look missing.
      }
    })();

    return () => {
      active = false;
    };
    // getToken is a new function on every render; leave it out on purpose.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, explorerId]);

  return useMemo(() => {
    if (!statuses || !cards) return EMPTY;
    const missing = new Set();
    cards.forEach((card) => {
      const status = statuses[String(card.id)];
      if (status !== 'owned' && status !== 'duplicated') missing.add(card.id);
    });
    return missing;
  }, [cards, statuses]);
};

export default useMissingCards;
