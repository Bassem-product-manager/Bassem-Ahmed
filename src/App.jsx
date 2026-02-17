import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Hero from './components/Hero';

const Timeline = lazy(() => import('./components/Timeline'));
const GlassDeck = lazy(() => import('./components/GlassDeck'));
const PortfolioSection = lazy(() => import('./components/PortfolioSection'));
const GitHubPortfolioSection = lazy(() => import('./components/GitHubPortfolioSection'));
const ConnectMeSection = lazy(() => import('./components/ConnectMeSection'));

function LazyMount({ children, minHeight = 420 }) {
  const [shouldRender, setShouldRender] = useState(false);
  const holderRef = useRef(null);

  useEffect(() => {
    const node = holderRef.current;
    if (!node || shouldRender) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: '380px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div ref={holderRef} style={{ minHeight: shouldRender ? undefined : `${minHeight}px` }}>
      {shouldRender ? <Suspense fallback={null}>{children}</Suspense> : null}
    </div>
  );
}

export default function App() {
  return (
    <>
      <Hero />
      <LazyMount minHeight={1200}>
        <Timeline />
      </LazyMount>
      <LazyMount minHeight={900}>
        <GlassDeck />
      </LazyMount>
      <LazyMount minHeight={980}>
        <PortfolioSection />
      </LazyMount>
      <LazyMount minHeight={900}>
        <GitHubPortfolioSection />
      </LazyMount>
      <LazyMount minHeight={780}>
        <ConnectMeSection />
      </LazyMount>
    </>
  );
}
