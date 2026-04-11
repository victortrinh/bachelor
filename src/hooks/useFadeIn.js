import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref and a `visible` boolean.
 * Attach `ref` to the element you want to observe.
 * `visible` becomes true once it enters the viewport (fires once, never reverts).
 */
export function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}
