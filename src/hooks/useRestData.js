import { useEffect, useState } from "react";

// Loads data once when the component mounts. load is a function that returns a promise
// (defined outside the component, so it's the same on every render).
// data is initialData until the data arrives; isLoaded is true once it has finished
// (with or without an error).
function useRestData(load, initialData) {
  const [data, setData] = useState(initialData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true; // ignore the result if the component unmounts first

    load()
      .then((result) => {
        if (isActive) setData(result);
      })
      .catch(() => {
        if (isActive) setHasError(true);
      })
      .finally(() => {
        if (isActive) setIsLoaded(true);
      });

    return () => {
      isActive = false;
    };
  }, [load]);

  return { data, isLoaded, hasError };
}

export default useRestData;
