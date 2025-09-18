import { useLayoutEffect } from "react";

export default function useStickyVars({
  ref,
  cssVarName,
  dimension = "height",
  root = typeof document !== "undefined" ? document.documentElement : null,
}) {
  useLayoutEffect(() => {
    const node = ref?.current;
    if (!node || !root || !cssVarName) return;

    const getSize = () =>
      dimension === "width" ? node.offsetWidth : node.offsetHeight;

    const updateVar = () => {
      const size = getSize();
      root.style.setProperty(cssVarName, `${size}px`);
    };

    updateVar();

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateVar);
      resizeObserver.observe(node);
    } else {
      window.addEventListener("resize", updateVar);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", updateVar);
      }
    };
  }, [ref, cssVarName, dimension, root]);
}
