import { useState, useEffect, useRef } from 'react';

export interface ContainerDimensions {
  width: number;
  height: number;
  isReady: boolean;
}

/**
 * Custom hook to monitor container width and height using ResizeObserver.
 * Dynamically updates when parent container dimensions change (e.g. sidebar toggle, window resize, grid reflow).
 */
export function useResizeObserver<T extends HTMLElement = HTMLDivElement>() {
  const [dimensions, setDimensions] = useState<ContainerDimensions>({
    width: 0,
    height: 0,
    isReady: false,
  });
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Immediate initial measurement
    const rect = element.getBoundingClientRect();
    setDimensions({
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      isReady: true,
    });

    let rafId: number;
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const newWidth = Math.round(entry.contentRect.width);
      const newHeight = Math.round(entry.contentRect.height);

      // Cancel previous frame to avoid ResizeObserver loop limit notifications
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setDimensions((prev) => {
          if (prev.width === newWidth && prev.height === newHeight) {
            return prev;
          }
          return {
            width: newWidth,
            height: newHeight,
            isReady: true,
          };
        });
      });
    });

    observer.observe(element);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return [elementRef, dimensions] as const;
}
