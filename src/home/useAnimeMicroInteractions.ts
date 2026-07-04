import { useEffect, type RefObject } from 'react';

type MicroRoot = RefObject<HTMLElement | null>;
type Cleanup = () => void;

type AnimeAnimation = {
  revert?: () => unknown;
  pause?: () => unknown;
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useAnimeMicroInteractions(rootRef: MicroRoot) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return undefined;

    let isMounted = true;
    const listeners: Cleanup[] = [];
    const animations: AnimeAnimation[] = [];

    void import('animejs').then(({ animate }) => {
      if (!isMounted || !rootRef.current) return;

      const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-micro]'));

      targets.forEach((target) => {
        const enter = () => {
          animations.push(
            animate(target, {
              translateY: -6,
              scale: 1.012,
              duration: 420,
              ease: 'outCubic',
            }),
          );
        };

        const leave = () => {
          animations.push(
            animate(target, {
              translateY: 0,
              scale: 1,
              duration: 520,
              ease: 'outExpo',
            }),
          );
        };

        target.addEventListener('pointerenter', enter);
        target.addEventListener('pointerleave', leave);
        target.addEventListener('focus', enter);
        target.addEventListener('blur', leave);

        listeners.push(() => {
          target.removeEventListener('pointerenter', enter);
          target.removeEventListener('pointerleave', leave);
          target.removeEventListener('focus', enter);
          target.removeEventListener('blur', leave);
        });
      });
    });

    return () => {
      isMounted = false;
      listeners.forEach((cleanup) => cleanup());
      animations.forEach((animation) => {
        animation.pause?.();
        animation.revert?.();
      });
    };
  }, [rootRef]);
}
