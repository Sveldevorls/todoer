import React, { useEffect, useState, useRef } from "react";

export default function useOnScreen(
  ref: React.RefObject<HTMLDivElement | null>
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isOnScreen, setIsOnScreen] = useState(true);

  const observerOptions = {
    root: document.body,
    rootMargin: "-56px",
    threshold: 0.6,
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => setIsOnScreen(entry.isIntersecting),
      observerOptions
    );
  }, []);

  useEffect(() => {
    observerRef.current!.observe(ref.current!);

    return () => {
      observerRef.current!.disconnect();
    };
  }, [ref]);

  return isOnScreen;
}
