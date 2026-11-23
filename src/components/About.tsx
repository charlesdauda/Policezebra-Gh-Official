import { useEffect, useRef, useState } from "react";
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
const GRID_QUERY = "(min-width: 1280px)"; 

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
          const eased = 1 - Math.pow(1 - p, 3);
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
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(VALUES.length);

  // Width of one "page" (everything visible at once) including the gap
  const pageWidth = () => {
    const el = scrollerRef.current;
    if (!el) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    return el.clientWidth + gap;
  };

  const goTo = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: index * pageWidth(), behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = scrollerRef.current;
    const w = pageWidth();
    if (!el || !w) return;
    setPage(Math.round(el.scrollLeft / w));
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      const w = pageWidth();
      if (!w) return;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      setPages(Math.max(1, Math.round((el.scrollWidth + gap) / w)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const markTouched = () => {
    lastTouch.current = Date.now();
  };

  useEffect(() => {
    const id = setInterval(() => {
      if (window.matchMedia(GRID_QUERY).matches) return;
      if (Date.now() - lastTouch.current < PAUSE_MS) return;
      const el = scrollerRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({
        left: atEnd ? 0 : el.scrollLeft + pageWidth(),
        behavior: "smooth",
      });
    }, AUTO_MS);

    return () => clearInterval(id);
  }, []);

  return (
    <section className="pb-14 pt-14 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-10 lg:gap-16">
          <div className="mx-auto w-full max-w-sm md:mx-0 md:max-w-none">
            <div className="overflow-hidden rounded-lg border border-(--border) bg-(--white)">
              <img
                src={aboutImg}
                alt="The Police Zebra story"
                loading="lazy"
                className="block max-h-140 w-full object-cover object-top"
              />
            </div>
          </div>
          
          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-(--black)">
              <span className="h-px w-8 bg-(--navy)" aria-hidden="true" />
              About us
            </span>

            <h2 className="flex flex-wrap gap-x-3 font-display text-[clamp(44px,6vw,84px)] leading-[0.95] tracking-[-0.045em] lowercase">
              <span className="font-extrabold text-transparent [-webkit-text-stroke:1.8px_var(--navy)] lg:[-webkit-text-stroke:2px_var(--navy)]">
                our
              </span>
              <span className="font-extrabold text-(--navy)">story</span>
            </h2>

            <p className="mt-5 max-w-xl text-lg font-medium leading-snug text-(--black) sm:mt-6 sm:text-xl">
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

        {/* Stats: 2 by 2 on mobile, one row from tablet up */}
        <dl className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 sm:mt-20 sm:grid-cols-4">
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
          <ul
            ref={scrollerRef}
            onScroll={handleScroll}
            onTouchStart={markTouched}
            onPointerDown={markTouched}
            onWheel={markTouched}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-none sm:gap-5 xl:grid xl:snap-none xl:grid-cols-4 xl:overflow-visible [&::-webkit-scrollbar]:hidden"
          >
            {VALUES.map((v) => (
              <li
                key={v.title}
                className="w-full shrink-0 snap-start sm:w-[calc(50%-10px)] xl:w-auto"
              >
                <div className="flex h-full flex-col rounded-lg border border-(--border) bg-(--white) p-6 transition-colors duration-300 hover:border-(--navy)/35 sm:p-7">
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
          {pages > 1 && (
            <div
              className="mt-5 flex justify-center gap-2 xl:hidden"
              role="tablist"
              aria-label="Our values"
            >
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === page}
                  aria-label={`Show page ${i + 1}`}
                  onClick={() => {
                    markTouched();
                    goTo(i);
                  }}
                  className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                    i === page ? "w-7 bg-(--navy)" : "w-2 bg-black/25"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;