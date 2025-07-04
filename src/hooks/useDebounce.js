import { useEffect, useState } from 'react';

const useDebounce = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounceValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    }
  }, [value, delay]);

  return debounceValue;
}

export default useDebounce;

// const search = '';

// const debounce = useDebounce(search, 5000);

// search = 'a';
// // make api request

// search = 'ab';
// // make api request
