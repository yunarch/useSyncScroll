import { useEffect, useCallback, type RefObject } from 'react';

/**
 * Sync scroll between multiple elements.
 *
 * @param refs - Array of RefObject of elements to sync scroll.
 * @param options - Options for sync scroll.
 *
 * @example
 * ```tsx
 *  const App = () => {
 *    const ref1 = useRef<HTMLDivElement>(null);
 *    const ref2 = useRef<HTMLDivElement>(null);
 *    useSyncScroll([ref1, ref2], {
 *      horizontal: true,
 *      vertical: false,
 *    });
 *    return (
 *      <>
 *        <div ref={ref1} style={{ overflow: "auto", width: "300px", height: "300px" }}>
 *          <div style={{ width: "500px" }}>Lorem ipsum dolor sit amet...</div>
 *        </div>
 *        <div ref={ref2} style={{ overflow: "auto", width: "300px", height: "300px" }}>
 *          <div style={{ width: "500px" }}>Lorem ipsum dolor sit amet...</div>
 *        </div>
 *      </>
 *    );
 *  };
 * ```
 */
export function useSyncScroll<T extends HTMLElement>(
  refs: [RefObject<T | null>, ...RefObject<T | null>[]],
  options: {
    vertical: boolean;
    horizontal: boolean;
  }
) {
  const handleScroll = useCallback(
    (event: Event) => {
      const target = event.target as T;
      const targetScrollLeft = target.scrollLeft;
      const targetScrollTop = target.scrollTop;
      const refsWithoutTarget = refs.filter(
        (ref) => ref.current !== event.target
      );
      for (const ref of refsWithoutTarget) {
        if (ref.current) {
          ref.current.style.willChange = 'scroll-position';
          if (options.horizontal) ref.current.scrollLeft = targetScrollLeft;
          if (options.vertical) ref.current.scrollTop = targetScrollTop;
        }
      }
    },
    [options.horizontal, options.vertical, refs]
  );
  useEffect(() => {
    const controller = new AbortController();
    for (const ref of refs) {
      ref.current?.addEventListener('scroll', handleScroll, {
        signal: controller.signal,
      });
    }
    return () => {
      controller.abort();
    };
  }, [handleScroll, refs]);
}
