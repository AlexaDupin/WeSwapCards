import { useEffect, useState } from "react";
import { axiosInstance } from "../../helpers/axiosInstance";

export default function useChapters(endpoint, params = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    // No endpoint means the caller already has the rows and passes them in.
    if (!endpoint) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await axiosInstance.get(endpoint, { params });
        const rows = Array.isArray(res.data?.items) ? res.data.items : [];
        if (!cancelled) setItems(rows);
      } catch (e) {
        if (!cancelled) {
          console.error(`[Home ${endpoint}] fetch error:`, e);
          setErr("Unable to load data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, JSON.stringify(params)]);

  return { items, loading, err };
}
