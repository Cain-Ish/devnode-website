// Scroll-reveal, applied only when the user has not requested reduced motion.
// CSS keeps all content visible by default; the .js root class gates hiding.
export function initReveal(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (targets.length === 0) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
  );
  targets.forEach((t) => io.observe(t));
}
