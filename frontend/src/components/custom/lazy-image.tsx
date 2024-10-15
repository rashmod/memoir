import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

type LazyImageProps = {
  src: string;
  alt?: string;
  placeholderSrc?: string;
  errorSrc?: string;
  className?: string;
};

export default function LazyImage({
  src,
  alt,
  className,
  errorSrc = 'https://placehold.jp/150x150.png',
}: LazyImageProps) {
  const [inView, setInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      threshold: 0,
      rootMargin: '100px',
    };

    function onIntersection(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
          // setTimeout(() => setInView(true), 1000);
          if (ref.current) observer.unobserve(ref.current);
        }
      });
    }

    const observer = new IntersectionObserver(onIntersection, observerOptions);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const displaySrc = (() => {
    if (isLoaded && hasError) return errorSrc;
    return src;
  })();

  function onLoad() {
    setIsLoaded(true);
  }

  function onError() {
    setIsLoaded(true);
    setHasError(true);
  }

  return (
    <>
      <img
        src={inView ? displaySrc : undefined}
        ref={ref}
        alt={alt}
        className={cn(className, { 'h-0': !isLoaded })}
        onLoad={onLoad}
        onError={onError}
      />
      {!isLoaded && <Skeleton className={cn(className, 'bg-muted-foreground/40')} />}
    </>
  );
}
