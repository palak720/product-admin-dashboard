import { useEffect, useState } from "react";

// value badalne ke `delay` ms baad hi debounced value badalti hai
export default function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    // value phir badli toh purana timer cancel. Yahi "wait until user stops typing" hai
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}