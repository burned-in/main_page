import { useEffect, type RefObject } from 'react';

type ScrollRoot = RefObject<HTMLElement | null>;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useGsapScrollEffects(rootRef: ScrollRoot) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return undefined;

    let isMounted = true;
    let cleanup = () => {};

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, scrollTriggerModule]) => {
      if (!isMounted || !rootRef.current) return;

      const { gsap } = gsapModule;
      const { ScrollTrigger } = scrollTriggerModule;

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const revealTargets = gsap.utils.toArray<HTMLElement>('[data-reveal]');
        revealTargets.forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 34 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.78,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: element,
                start: 'top 84%',
                once: true,
              },
            },
          );
        });

        const depthTargets = gsap.utils.toArray<HTMLElement>('[data-depth]');
        depthTargets.forEach((element) => {
          const depth = Number(element.dataset.depth || '0.12');

          gsap.fromTo(
            element,
            { yPercent: -depth * 100 },
            {
              yPercent: depth * 100,
              ease: 'none',
              scrollTrigger: {
                trigger: root,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
              },
            },
          );
        });

        const storySteps = gsap.utils.toArray<HTMLElement>('[data-scene-step]');
        storySteps.forEach((element) => {
          const direction = element.dataset.side === 'right' ? 1 : -1;

          gsap
            .timeline({
              scrollTrigger: {
                trigger: element,
                start: 'top 82%',
                end: 'bottom 18%',
                scrub: 1.25,
              },
            })
            .fromTo(
              element,
              { autoAlpha: 0.08, x: direction * 34, y: 92, filter: 'blur(8px)' },
              { autoAlpha: 1, x: 0, y: 0, filter: 'blur(0px)', duration: 0.45, ease: 'power2.out' },
              0,
            )
            .to(
              element,
              { autoAlpha: 0.1, x: direction * -28, y: -86, filter: 'blur(7px)', duration: 0.38, ease: 'power2.in' },
              0.62,
            );
        });
      }, rootRef.current);

      cleanup = () => ctx.revert();
    });

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [rootRef]);
}
