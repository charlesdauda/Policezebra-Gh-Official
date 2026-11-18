import { useEffect, useRef, useState } from "react";
// Replace with your own image (rename the file or change the path)
import aboutImg from "../assets/images/about.png";

const STATS = [
  { value: 18, suffix: "+", label: "Years of style" },
  { value: 10, suffix: "K+", label: "Happy customers" },
  { value: 200, suffix: "+", label: "Unique pieces" },
  { value: 100, suffix: "%", label: "Unisex friendly" },
];

const VALUES = [
  {
    icon: "ri-scissors-2-line",
    title: "Crafted with care",
    text: "Quality fabrics and clean finishing, so every piece looks sharp and lasts.",
  },
  {
    icon: "ri-shirt-line",
    title: "Made to be shared",
    text: "Unisex essentials sit alongside dedicated menswear and womenswear.",
  },
  {
    icon: "ri-sun-line",
    title: "Built for every day",
    text: "Easy layers and relaxed cuts that move with you from morning to midnight.",
  },
  {
    icon: "ri-map-pin-2-line",
    title: "Rooted in Ghana",
    text: "Designed with local style and pride, and made for the way we live.",
  },
];

const AUTO_MS = 4000;
const PAUSE_MS = 6000;
const MOBILE_QUERY = "(max-width: 639px)";

/* Counts from 0 to the real number when it scrolls into view */
const CountUp = ({
  to,
  suffix = "",
  duration = 1800,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3); // ease-out
          setN(Math.round(to * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
};

const About = () => {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const lastTouch = useRef(0);
  const [active, setActive] = useState(0);

  const goTo = (index: number) => {
    const el = scrollerRef.current;
    const child = el?.children[index] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  };

  // Track which card is showing (also updates when the user swipes)
  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    let nearest = 0;
    let best = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const dist = Math.abs((child as HTMLElement).offsetLeft - el.scrollLeft);
      if (dist < best) {
        best = dist;
        nearest = i;
      }
    });
    setActive(nearest);
  };

  const markTouched = () => {
    lastTouch.current = Date.now();
  };

  // Auto-advance on mobile only
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      if (!window.matchMedia(MOBILE_QUERY).matches) return;
      if (Date.now() - lastTouch.current < PAUSE_MS) return;
      goTo((active + 1) % VALUES.length);
    }, AUTO_MS);

    return () => clearInterval(id);
  }, [active]);

  return (
    <section className="pb-14 pt-14 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6">
        {/* Intro */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image: always shown in full (no cropping), so the head is never cut off */}
          <div className="mx-auto w-full max-w-md overflow-hidden rounded-xl border border-(--border) bg-(--white) sm:max-w-lg lg:mx-0 lg:max-w-125">
            <img
              src={aboutImg}
              alt="The Police Zebra story"
              loading="lazy"
              className="block h-auto w-full"
            />
          </div>

          {/* Copy */}
          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-(--black)">
              <span className="h-px w-8 bg-(--navy)" aria-hidden="true" />
              About us
            </span>

            <h2 className="flex flex-wrap font-display text-[clamp(44px,6vw,84px)] leading-[0.95] tracking-[-0.045em] lowercase">
              <span className="font-extrabold text-transparent [-webkit-text-stroke:1.8px_var(--navy)] lg:[-webkit-text-stroke:2px_var(--navy)]">
                our
              </span>
              <span className="font-extrabold text-(--navy)">story</span>
            </h2>

            <p className="mt-6 max-w-xl text-lg font-medium leading-snug text-(--black) sm:text-xl">
              Clothing that feels as good as it looks, designed for everyone.
            </p>

            <div className="mt-4 max-w-xl space-y-4 text-base leading-[1.65] text-(--grey) sm:text-[17px]">
              <p>
                Police Zebra started in 2008 with a simple idea: great style
                should be easy, comfortable and open to everyone. Since then
                we have grown from a small label into a trusted name for
                everyday fashion.
              </p>
              <p>
                Today we create clean cuts and easy layers, from unisex staples
                to dedicated menswear and womenswear. Every piece is made with
                the same care, so you can dress well without trying too hard.
              </p>
            </div>
          </div>
        </div>

        {/* Stats: navy text, no borders */}
        <dl className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 sm:mt-20 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <dd className="font-display text-[clamp(32px,4vw,48px)] font-extrabold leading-none tracking-[-0.04em] text-(--navy)">
                <CountUp to={s.value} suffix={s.suffix} />
              </dd>
              <dt className="mt-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-(--navy) sm:text-[13px]">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>

        {/* Values */}
        <div className="mt-16 sm:mt-20">
          <div className="mb-6 flex flex-col gap-2 sm:mb-10">
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-(--black)">
              <span className="h-px w-8 bg-(--navy)" aria-hidden="true" />
              Our values
            </span>
            <h3 className="text-[26px] font-semibold uppercase leading-none tracking-[0.01em] text-(--black) sm:text-[32px]">
              What we stand for
            </h3>
          </div>

          {/* Mobile: one card at a time, auto-scrolling. Tablet/desktop: grid */}
          <ul
            ref={scrollerRef}
            onScroll={handleScroll}
            onTouchStart={markTouched}
            onPointerDown={markTouched}
            onWheel={markTouched}
            className="relative flex snap-x snap-mandatory overflow-x-auto scrollbar-none sm:grid sm:snap-none sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
          >
            {VALUES.map((v) => (
              <li key={v.title} className="w-full shrink-0 snap-start sm:w-auto">
                {/* Same card layout and size on mobile, tablet and desktop */}
                <div className="flex h-full flex-col rounded-xl border border-(--border) bg-(--white) p-6 transition-colors duration-300 hover:border-(--navy)/35 sm:p-7">
                  <i
                    className={`${v.icon} block text-[32px] leading-none text-(--navy)`}
                    aria-hidden="true"
                  />
                  <h4 className="mt-5 text-[20px] font-semibold uppercase leading-tight tracking-[0.01em] text-(--black)">
                    {v.title}
                  </h4>
                  <p className="mt-2.5 text-[15px] leading-normal text-(--grey)">
                    {v.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Mobile dots */}
          <div
            className="mt-4 flex justify-center gap-2 sm:hidden"
            role="tablist"
            aria-label="Our values"
          >
            {VALUES.map((v, i) => (
              <button
                key={v.title}
                role="tab"
                aria-selected={i === active}
                aria-label={`Show ${v.title}`}
                onClick={() => {
                  markTouched();
                  goTo(i);
                }}
                className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                  i === active ? "w-7 bg-(--navy)" : "w-2 bg-black/25"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;