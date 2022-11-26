import { useState, useEffect, RefObject } from "react";

const useIntersectionObserver = (
  elementRef: RefObject<Element>,
  observerParams: IntersectionObserverInit | undefined = {
    root: null,
    threshold: 0.5,
    rootMargin: "0%",
  },
  freezeOnceVisible: boolean = false
): boolean => {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
  };

  useEffect(() => {
    const node = elementRef?.current; // DOM Ref
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;
    const observer = new IntersectionObserver(updateEntry, observerParams);
    observer.observe(node);

    return () => observer.disconnect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    elementRef?.current,
    JSON.stringify(observerParams.threshold),
    observerParams.root,
    observerParams.rootMargin,
    frozen,
  ]);

  return !!entry?.isIntersecting;
};

export default useIntersectionObserver;
