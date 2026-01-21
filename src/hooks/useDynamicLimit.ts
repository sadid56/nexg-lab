import { useState, useEffect } from "react";

export const useDynamicLimit = (defaultLimit: number = 3) => {
  const [limit, setLimit] = useState(defaultLimit);

  useEffect(() => {
    const updateLimit = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (width > 2000) {
        setLimit(5);
      } else if (height > 1000) {
        setLimit(4);
      } else {
        setLimit(defaultLimit);
      }
    };

    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, [defaultLimit]);

  return limit;
};
