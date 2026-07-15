import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

let lenis: Lenis | null = null;
let splits: SplitText[] = [];
let runId = 0;
let fieldTicker: ((time: number) => void) | null = null;

const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Kill page-scoped animation state before a view-transition swap. */
export function cleanupMotion(): void {
  ScrollTrigger.getAll().forEach((t) => t.kill());
  splits.forEach((s) => s.revert());
  splits = [];
  if (fieldTicker) {
    gsap.ticker.remove(fieldTicker);
    fieldTicker = null;
  }
}

/**
 * Called on every astro:page-load. Lenis is created once and driven by
 * gsap.ticker (autoRaf off, lagSmoothing off) so ScrollTrigger and scroll
 * position update in the same frame. Reduced motion: nothing runs; base.css
 * shows all content instantly.
 */
export function initMotion(): void {
  if (reduced()) return;
  cleanupMotion(); // idempotent: direct call + astro:page-load may both fire

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
  const id = ++runId;
  document.fonts.ready.then(() => {
    if (id !== runId) return; // superseded by a newer init
    heroEntrance();
    heroField();
    titleReveals();
    revealOnScroll();
    timelineSpine();
    mapDraw();
    mapHover();
    pipelineCascade();
    impactCounters();
    navBehavior();
    smoothAnchors();
    ScrollTrigger.refresh();
  });
}

/**
 * Site-wide ambient "data field": drifting sample points, hairline links when
 * close, a few ultramarine signals. Fixed behind all content on every page.
 */
function heroField(): void {
  const canvas = document.querySelector<HTMLCanvasElement>("#site-field");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;
  const resize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();

  const N = 46;
  const LINK = 120;
  const pts = Array.from({ length: N }, (_, i) => ({
    x: Math.random() * 1,
    y: Math.random() * 1,
    vx: (Math.random() - 0.5) * 0.0013,
    vy: (Math.random() - 0.5) * 0.0013,
    signal: i % 9 === 0,
  }));

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1;
    for (let i = 0; i < N; i++) {
      const p = pts[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > 1) p.vx *= -1;
      if (p.y < 0 || p.y > 1) p.vy *= -1;
    }
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = (pts[i].x - pts[j].x) * w;
        const dy = (pts[i].y - pts[j].y) * h;
        const d = Math.hypot(dx, dy);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(200, 197, 186, ${0.5 * (1 - d / LINK)})`;
          ctx.beginPath();
          ctx.moveTo(pts[i].x * w, pts[i].y * h);
          ctx.lineTo(pts[j].x * w, pts[j].y * h);
          ctx.stroke();
        }
      }
    }
    for (const p of pts) {
      ctx.fillStyle = p.signal ? "#2742D6" : "#63666D";
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, p.signal ? 2.4 : 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  fieldTicker = draw;
  gsap.ticker.add(draw);
  window.addEventListener("resize", resize, { passive: true });
}

/** Flagship pipeline stages cascade in one after another. */
function pipelineCascade(): void {
  const stages = gsap.utils.toArray<HTMLElement>("[data-stage]");
  if (!stages.length) return;
  gsap.from(stages, {
    opacity: 0,
    y: 18,
    duration: 0.7,
    ease: "power2.out",
    stagger: 0.16,
    scrollTrigger: { trigger: stages[0], start: "top 85%", once: true },
  });
}

/** Impact numbers count up from zero, suffixes preserved (42M, 1.28M). */
function impactCounters(): void {
  document.querySelectorAll<HTMLElement>("[data-counter]").forEach((el) => {
    const m = el.textContent?.trim().match(/^([\d.]+)(.*)$/);
    if (!m) return;
    const target = parseFloat(m[1]);
    const suffix = m[2] ?? "";
    const decimals = (m[1].split(".")[1] ?? "").length;
    const state = { n: 0 };
    gsap.to(state, {
      n: target,
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      onUpdate: () => {
        el.textContent = state.n.toFixed(decimals) + suffix;
      },
    });
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
