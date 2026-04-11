import { useFadeIn } from '@/hooks/useFadeIn';

/**
 * Wraps a page section in a fade-in observer.
 * Usage: <SectionWrapper className="py-20 max-w-3xl mx-auto px-6">...</SectionWrapper>
 */
export default function SectionWrapper({ children, className = '' }) {
  const { ref, visible } = useFadeIn();
  return (
    <section
      ref={ref}
      className={`fade-section ${visible ? 'visible' : ''} ${className}`}
    >
      {children}
    </section>
  );
}
