import { useCallback, useEffect, useMemo, useState } from "react";

export default function useOnboarding({
  storageKey = "wsc_onboarding_seen",
  shouldOpen = false,
  steps = [],
}) {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const alreadySeen = localStorage.getItem(storageKey) === "1";
    if (shouldOpen && !alreadySeen) setShow(true);
  }, [shouldOpen, storageKey]);

  const total = steps.length;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const closeAndRemember = useCallback(() => {
    localStorage.setItem(storageKey, "1");
    setShow(false);
  }, [storageKey]);

  const handleNext = useCallback(() => setIndex(i => Math.min(i + 1, total - 1)), [total]);
  const handlePrev = useCallback(() => setIndex(i => Math.max(i - 1, 0)), []);
  const goTo = useCallback((i) => setIndex(i), []);

  const currentStep = useMemo(() => steps[index], [steps, index]);

  return {
    show, index, total, isFirst, isLast, currentStep,
    setShow, setIndex, handleNext, handlePrev, goTo, closeAndRemember
  };
}
