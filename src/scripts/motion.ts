import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Lenis driven by gsap.ticker (autoRaf off, lagSmoothing off) so ScrollTrigger
 * and scroll position update in the same frame — avoids 1–2 frame lag.
 * Reduced motion: skip everything; base.css shows content instantly.
 */
export function initMotion(): Lenis | null {
  if (prefersReducedMotion()) return null; // base.css shows everything instantly

  const lenis = new Lenis({ autoRaf: false, lerp: 0.12 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  heroEntrance();
  revealOnScroll();
  timelineSpine();
  mapDraw();
  ScrollTrigger.refresh();
  return lenis;
}

/** Staggered hero entrance on load, ordered by data-hero index. */
function heroEntrance(): void {
  const items = gsap.utils.toArray<HTMLElement>("[data-hero]");
  if (!items.length) return;
  items.sort(
    (a, b) => Number(a.dataset.hero ?? 0) - Number(b.dataset.hero ?? 0),
  );
  gsap.fromTo(
    items,
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.12 },
  );
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

/** Ultramarine progress line grows down the timeline spine while scrolling. */
function timelineSpine(): void {
  const spine = document.querySelector<HTMLElement>(".spine-progress");
  const list = document.querySelector<HTMLElement>("[data-timeline]");
  if (!spine || !list) return;
  gsap.to(spine, {
    scaleY: 1,
    ease: "none",
    scrollTrigger: {
      trigger: list,
      start: "top 75%",
      end: "bottom 60%",
      scrub: 0.6,
    },
  });
}

/** Research map: edges draw in, nodes fade up, when the map scrolls into view. */
function mapDraw(): void {
  const svg = document.querySelector<SVGSVGElement>("[data-map]");
  if (!svg) return;

  const edges = svg.querySelectorAll<SVGLineElement>("[data-edge]");
  edges.forEach((edge) => {
    const len = Math.hypot(
      Number(edge.getAttribute("x2")) - Number(edge.getAttribute("x1")),
      Number(edge.getAttribute("y2")) - Number(edge.getAttribute("y1")),
    );
    edge.style.strokeDasharray = `${len}`;
    edge.style.strokeDashoffset = `${len}`;
  });

  const tl = gsap.timeline({
    scrollTrigger: { trigger: svg, start: "top 75%", once: true },
  });

  tl.to(edges, {
    strokeDashoffset: 0,
    duration: 1.4,
    ease: "power2.inOut",
    stagger: 0.05,
  }).from(
    svg.querySelectorAll("[data-node]"),
    { opacity: 0, duration: 0.6, ease: "power2.out", stagger: 0.04 },
    "-=0.9",
  );
}
