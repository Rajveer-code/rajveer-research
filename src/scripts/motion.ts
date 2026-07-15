import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Lenis driven by gsap.ticker (autoRaf off, lagSmoothing off) so ScrollTrigger
 * and scroll position update in the same frame — avoids 1–2 frame lag.
 */
export function initMotion(): Lenis | null {
  if (prefersReducedMotion()) return null;

  const lenis = new Lenis({ autoRaf: false, lerp: 0.12 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  revealOnScroll();
  ScrollTrigger.refresh();
  return lenis;
}

/** Animate every [data-reveal] element as it enters the viewport. */
function revealOnScroll(): void {
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });
}
