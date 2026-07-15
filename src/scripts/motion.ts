import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

let lenis: Lenis | null = null;
let splits: SplitText[] = [];

const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Kill page-scoped animation state before a view-transition swap. */
export function cleanupMotion(): void {
  ScrollTrigger.getAll().forEach((t) => t.kill());
  splits.forEach((s) => s.revert());
  splits = [];
}

/**
 * Called on every astro:page-load. Lenis is created once and driven by
 * gsap.ticker (autoRaf off, lagSmoothing off) so ScrollTrigger and scroll
 * position update in the same frame. Reduced motion: nothing runs; base.css
 * shows all content instantly.
 */
export function initMotion(): void {
  if (reduced()) return;

  if (!lenis) {
    lenis = new Lenis({ autoRaf: false, lerp: 0.12 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis!.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    // sync internal position with the router's scroll reset
    lenis.scrollTo(window.scrollY, { immediate: true, force: true });
  }

  // split only after fonts settle so line boxes are final
  document.fonts.ready.then(() => {
    heroEntrance();
    titleReveals();
    revealOnScroll();
    timelineSpine();
    mapDraw();
    mapHover();
    navBehavior();
    smoothAnchors();
    ScrollTrigger.refresh();
  });
}

/** Hero: masked line reveal on the headline, staggered fade for the rest. */
function heroEntrance(): void {
  const items = gsap.utils.toArray<HTMLElement>("[data-hero]");
  if (!items.length) return;
  items.sort((a, b) => Number(a.dataset.hero ?? 0) - Number(b.dataset.hero ?? 0));

  const headline = items.find((el) =>
    el.classList.contains("hero-headline") || el.classList.contains("paper-title"),
  );
  const rest = items.filter((el) => el !== headline);

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (headline) {
    const split = SplitText.create(headline, { type: "lines", mask: "lines" });
    splits.push(split);
    gsap.set(headline, { opacity: 1 });
    tl.from(split.lines, {
      yPercent: 115,
      duration: 1.1,
      stagger: 0.09,
    });
  }

  tl.fromTo(
    rest,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 },
    headline ? "-=0.7" : 0,
  );
}

/** Homepage section titles: masked line reveal as they enter the viewport. */
function titleReveals(): void {
  document
    .querySelectorAll<HTMLElement>("h2.section-title, .flagship-title")
    .forEach((el) => {
      const split = SplitText.create(el, { type: "lines", mask: "lines" });
      splits.push(split);
      gsap.from(split.lines, {
        yPercent: 115,
        duration: 1,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 86%", once: true },
      });
    });
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

/** Hovering a theme node spotlights its spoke; everything else recedes. */
function mapHover(): void {
  const svg = document.querySelector<SVGSVGElement>("[data-map]");
  if (!svg) return;
  svg.querySelectorAll<SVGGElement>("[data-node-idx]").forEach((node) => {
    const idx = node.dataset.nodeIdx!;
    const spoke = svg.querySelector(`[data-edge-idx="${idx}"]`);
    node.addEventListener("mouseenter", () => {
      svg.classList.add("is-hover");
      node.classList.add("is-hot");
      spoke?.classList.add("is-hot");
    });
    node.addEventListener("mouseleave", () => {
      svg.classList.remove("is-hover");
      node.classList.remove("is-hot");
      spoke?.classList.remove("is-hot");
    });
  });
}

/** Nav: recede while scrolling down, return on scroll up; mark active section. */
function navBehavior(): void {
  const nav = document.querySelector<HTMLElement>(".nav");
  if (!nav) return;

  ScrollTrigger.create({
    start: 120,
    end: "max",
    onUpdate: (self) => {
      nav.classList.toggle("nav--hidden", self.direction === 1);
    },
    onLeaveBack: () => nav.classList.remove("nav--hidden"),
  });

  const links = document.querySelectorAll<HTMLAnchorElement>(".nav-links a");
  const byHash = new Map<string, HTMLAnchorElement>();
  links.forEach((l) => {
    const hash = l.getAttribute("href")?.split("#")[1];
    if (hash) byHash.set(hash, l);
  });

  byHash.forEach((link, id) => {
    const section = document.getElementById(id);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: "top 40%",
      end: "bottom 40%",
      onToggle: (self) => {
        if (self.isActive) {
          links.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        } else {
          link.classList.remove("is-active");
        }
      },
    });
  });
}

/** Same-page anchor clicks glide via Lenis instead of jumping. */
function smoothAnchors(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href*="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const url = new URL(a.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.querySelector(url.hash);
      if (!target || !lenis) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -72, duration: 1.1 });
      history.pushState(null, "", url.hash);
    });
  });
}
