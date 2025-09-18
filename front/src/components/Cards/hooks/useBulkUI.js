import { useCallback, useState } from "react";

export default function useBulkUI() {
  const [toast, setToast] = useState({ visible: false, type: null, message: "" });

  const showToast = useCallback(({ type, message }) => {
    setToast({ visible: true, type: type ?? null, message: message ?? "" });
  }, []);

  const hideToast = useCallback(() => {
    setToast({ visible: false, type: null, message: "" });
  }, []);

  return { toast, showToast, hideToast };
}
