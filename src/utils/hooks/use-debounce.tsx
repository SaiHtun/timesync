import { useState, useEffect } from "react";

export function useDebounce(defaultValue: any, delay = 500) {
  const [value, setState] = useState(defaultValue);

  useEffect(() => {
    const timeoutId = setTimeout(() => setState(defaultValue), delay);

    return () => clearTimeout(timeoutId);
  }, [defaultValue]);

  return value;
}
