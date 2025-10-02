import { useEffect, useRef } from "react";

export function useOutsideClick(
  handler,
  listenCapturing = true,
  disabled = false
) {
  const ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        if (disabled) return;

        if (ref.current && !ref.current.contains(e.target)) {
          handler();
        }
      }

      document.addEventListener("click", handleClick, listenCapturing);

      return () =>
        document.removeEventListener("click", handleClick, listenCapturing);
    },
    [handler, listenCapturing, disabled]
  );

  return ref;
}
