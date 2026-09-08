import { useState, useEffect } from 'react';

/**
 * Custom React hook that debounces a value by delayMs.
 * Prevents unnecessary re-renders, expensive array filters, and API spam while typing.
 */
export function useDebounce<T>(value: T, delayMs: number = 250): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
