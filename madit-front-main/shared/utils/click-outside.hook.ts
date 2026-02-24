import { useEffect, useRef } from "react";

export function useClickOutside(callback: () => any) {
  const ref = useRef<HTMLElement>(null);

  const handleClick = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return ref;
}
