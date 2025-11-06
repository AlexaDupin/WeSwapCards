import { useReducer, useEffect, useContext, useRef } from "react"
import { useAuth } from "@clerk/clerk-react";
import { DispatchContext } from "../contexts/DispatchContext";
import { StateContext } from "../contexts/StateContext";
import { reducer, initialState } from "../reducers/mainReducer";
import { axiosInstance } from "../helpers/axiosInstance";

function safeParse(json) {
    try { return JSON.parse(json); } catch { return null; }
}

function normalizeExplorer(obj) {
  if (!obj || typeof obj !== "object") return { id: "", name: "" };
  const id = obj.explorerId ?? obj.id ?? "";
  const name = obj.explorerName ?? obj.name ?? "";
  return { id: id ? String(id) : "", name: name || "" };
}

function toExplorerSetPayload(norm) {
  return { explorerId: norm.id, explorerName: norm.name };
}

function AuthWatcher() {
    const { isLoaded, isSignedIn } = useAuth();
    const dispatch = useContext(DispatchContext);
  
    useEffect(() => {
      if (!isLoaded) return;
      if (!isSignedIn) {
        dispatch({ type: "explorer/reset" });
        return;
      }

      const savedRaw = safeParse(localStorage.getItem("explorer"));
      const saved = normalizeExplorer(savedRaw);
      if (saved.id) {
        dispatch({ type: "explorer/set", payload: toExplorerSetPayload(saved) });
      }
    }, [isLoaded, isSignedIn, dispatch]);
  
    return null;
}

function BootAuthLoader({ hasExplorer }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const dispatch = useContext(DispatchContext);
  const didRunRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || hasExplorer) return;

    // avoid double-run (React strict mode)
    if (didRunRef.current) return;
    didRunRef.current = true;

    (async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await axiosInstance.post(
          "/login/user",
          { userUID: (window.Clerk?.user?.id) || undefined },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const fetched = normalizeExplorer(res?.data);
        if (fetched.id) {
          dispatch({
            type: "explorer/set",
            payload: toExplorerSetPayload(fetched),
          });

          try {
            localStorage.setItem("explorer", JSON.stringify(fetched));
          } catch {}
        }
      } catch {
      }
    })();
  }, [isLoaded, isSignedIn, hasExplorer, getToken, dispatch]);

  return null;
}

const StoreContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(
        reducer,
        initialState,
        (init) => {
          const savedRaw = safeParse(localStorage.getItem("explorer"));
          const saved = normalizeExplorer(savedRaw);
          return saved.id ? { ...init, explorer: { id: saved.id, name: saved.name } } : init;
        }
    );

    useEffect(() => {
      try {
        const norm = normalizeExplorer(state.explorer);
        if (norm.id) {
          localStorage.setItem("explorer", JSON.stringify(norm));
        } else {
          localStorage.removeItem("explorer");
        }
      } catch (e) {
      }
    }, [state.explorer]);

    const hasExplorer = Boolean(state?.explorer?.id);

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
              <AuthWatcher />
              <BootAuthLoader hasExplorer={hasExplorer} />
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}

export default StoreContextProvider;