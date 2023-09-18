import React from 'react';
import { useEffect, useState, useMemo } from 'react';


const useIsInView = (ref: any) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const observer = useMemo(() => new IntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting),
    { rootMargin: "150px" },
  ), []
  );

  useEffect(() => {
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);

  return isIntersecting;
}

export default useIsInView;