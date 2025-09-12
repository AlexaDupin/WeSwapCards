import { useRef, useCallback } from "react";

export default function useLongPress(onLongPress, { threshold = 450, disabled = false } = {}) {
  const timer = useRef(null);
  const didLongPress = useRef(false);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const onPointerDown = useCallback((e) => {
    if (disabled) return;
    didLongPress.current = false;
    clear();
    timer.current = setTimeout(() => {
      didLongPress.current = true;
      onLongPress?.(e);
    }, threshold);
  }, [onLongPress, threshold, disabled]);

  const onPointerUp = useCallback((e) => {
    clear();
    return didLongPress.current;
  }, []);

  const onPointerLeave = clear;
  const onPointerCancel = clear;

  return { onPointerDown, onPointerUp, onPointerLeave, onPointerCancel, wasLongPressRef: didLongPress };
}
