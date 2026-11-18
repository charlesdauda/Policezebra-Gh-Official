import { useEffect, useRef, useState } from "react";

// Replace these with your own images (rename the files to match, or change the paths)
import essentialsImg from "../assets/images/essentials.png";
import menImg from "../assets/images/dunmis.png";
import womenImg from "../assets/images/outfit.png";

interface Collection {
  title: string;
  text: string;
  image: string;
  variant: "below" | "overlay";
}

const COLLECTIONS: Collection[] = [
  {
    title: "Trending essentials",
    text: "You can't resist 'em!",
    image: essentialsImg,
    variant: "below",
  },
  {
    title: "Menswear",
    text: "Sharp cuts, everyday ease.",
    image: menImg,
    variant: "overlay",
  },
  {
    title: "Womenswear",
    text: "Effortless from day to night.",
    image: womenImg,
    variant: "overlay",
  },
];

const TOP_COLLECTIONS = [
  "Tees",
  "Hoodies",
  "Unisex essentials",
  "Back in stock",
  "New arrivals",
  "Shorts",
];

const AUTO_MS = 4000;
const PAUSE_MS = 6000;
const MOBILE_QUERY = "(max-width: 639px)";

const imgClass =
  "absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105";

const Card = ({ c }: { c: Collection }) => {
  if (c.variant === "below") {
    return (
      <article className="group flex h-full flex-col">
        <div className="relative min-h-55 flex-1 overflow-hidden rounded-lg">
          <img src={c.image} alt={c.title} loading="lazy" className={imgClass} />
        </div>

        <div className="pt-5">
          <div className="flex items-center gap-4">
            <h3 className="text-[26px] font-semibold uppercase leading-none tracking-[0.01em] text-(--black) max-sm:text-[22px]">
              {c.title}
            </h3>
            {/* Decorative arrow */}
            <svg
              className="hidden h-2.5 w-14 shrink-0 text-(--navy) sm:block"
              viewBox="0 0 56 10"
              fill="none"
              aria-hidden="true"
            >
              <path d="M0 5H48" stroke="currentColor" strokeWidth="1.5" />
              <path d="M46 1L55 5L46 9Z" fill="currentColor" />
            </svg>
          </div>
          <p className="mt-3 text-base text-(--grey)">{c.text}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative aspect-563/503 overflow-hidden rounded-lg">
      <img src={c.image} alt={c.title} loading="lazy" className={imgClass} />

      {/* Readability gradient */}
      <div
        className="absolute inset-0 bg-linear-to-t from-(--black)/75 via-(--black)/15 to-transparent"
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <h3 className="text-[26px] font-semibold uppercase leading-none tracking-[0.01em] text-(--white) max-sm:text-[22px]">
          {c.title}
        </h3>
        <p className="mt-3 text-base text-white/85">{c.text}</p>
      </div>
    </article>
  );
};

const Collections = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = setInterval(() => {
      if (!window.matchMedia(MOBILE_QUERY).matches) return;
      if (Date.now() - lastTouch.current < PAUSE_MS) return;
      goTo((active + 1) % COLLECTIONS.length);
    }, AUTO_MS);

    return () => clearInterval(id);
  }, [active]);

  return (
    <section className="pb-14 pt-10 sm:pb-20 lg:pt-14">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6">
        {/* Mobile: one card at a time, auto-scrolling. Tablet: swipeable row. Desktop: 3-column grid */}
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          onTouchStart={markTouched}
          onPointerDown={markTouched}
          onWheel={markTouched}
          className="relative flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto pb-2 scrollbar-none sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {COLLECTIONS.map((c) => (
            <div
              key={c.title}
              className="w-full shrink-0 snap-start sm:w-[46%] lg:w-auto"
            >
              <Card c={c} />
            </div>
          ))}
        </div>

        {/* Mobile dots */}
        <div
          className="mt-4 flex justify-center gap-2 sm:hidden"
          role="tablist"
          aria-label="Collections"
        >
          {COLLECTIONS.map((c, i) => (
            <button
              key={c.title}
              role="tab"
              aria-selected={i === active}
              aria-label={`Show ${c.title}`}
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

        {/* Top collections: hidden on mobile */}
        <div className="mt-12 hidden flex-col gap-5 sm:mt-16 sm:flex lg:flex-row lg:items-center lg:gap-10">
          <h2 className="shrink-0 text-[24px] font-semibold uppercase leading-none tracking-[0.01em] text-(--black) sm:text-[26px]">
            Top collections
          </h2>

          <ul className="flex flex-wrap gap-4">
            {TOP_COLLECTIONS.map((label) => (
              <li
                key={label}
                className="inline-flex h-14 shrink-0 items-center justify-center rounded-md border border-(--black) px-9 text-[14px] font-medium uppercase tracking-[0.04em] text-(--black)"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Collections;