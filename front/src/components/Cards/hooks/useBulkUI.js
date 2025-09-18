import { useCallback, useState } from "react";

export default function useBulkUI() {
  const [toast, setToast] = useState({ visible: false, type: null });

  const showToast = useCallback((type) => {
    setToast({ visible: true, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast({ visible: false, type: null });
  }, []);

  return { toast, showToast, hideToast };
}
