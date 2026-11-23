import { useCallback, useEffect, useRef, useState } from "react";
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
  "T-shirts",
  "Hoodies",
  "Flipflops",
  "Slippers",
  "Shorts",
  "Boxers",
  "Lacoste",
  "Socks",
  "Underpants",
  "Aprons",
  "Mugs",
  "Tote bags",
];

const AUTO_MS = 4000;
const PAUSE_MS = 6000;
const CAROUSEL_QUERY = "(max-width: 1279px)";

const imgClass =
  "absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105";

const Card = ({ c }: { c: Collection }) => {
  if (c.variant === "below") {
    return (
      <article className="group flex h-full flex-col">
        <div className="relative aspect-563/503 overflow-hidden rounded-lg xl:aspect-auto xl:min-h-55 xl:flex-1">
          <img src={c.image} alt={c.title} loading="lazy" className={imgClass} />
        </div>

        <div className="pt-5">
          <div className="flex items-center gap-4">
            <h3 className="text-[26px] font-semibold uppercase leading-none tracking-[0.01em] text-(--black) max-sm:text-[22px]">
              {c.title}
            </h3>
            {/* Decorative arrow */}
            <svg
              className="hidden h-2.5 w-14 shrink-0 text-(--navy) xl:block"
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
      <div
        className="absolute inset-0 bg-linear-to-t from-(--black)/75 via-(--black)/15 to-transparent"
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 xl:p-8">
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
  const [positions, setPositions] = useState(COLLECTIONS.length);
  
  const stepWidth = useCallback(() => {
    const el = scrollerRef.current;
    const first = el?.children[0] as HTMLElement | undefined;
    if (!el || !first) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    return first.offsetWidth + gap;
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const el = scrollerRef.current;
      if (!el) return;
      el.scrollTo({ left: index * stepWidth(), behavior: "smooth" });
    },
    [stepWidth]
  );

  const handleScroll = () => {
    const el = scrollerRef.current;
    const step = stepWidth();
    if (!el || !step) return;
    setActive(Math.round(el.scrollLeft / step));
  };

  // How many stops there are: 3 on mobile (1 card visible), 2 on tablet (2 visible)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      const step = stepWidth();
      if (!step) return;
      const max = el.scrollWidth - el.clientWidth;
      setPositions(Math.max(1, Math.round(max / step) + 1));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [stepWidth]);

  const markTouched = () => {
    lastTouch.current = Date.now();
  };

  // Auto-advance one card at a time below 1280px, looping back to the first
  useEffect(() => {
    const id = setInterval(() => {
      if (!window.matchMedia(CAROUSEL_QUERY).matches) return;
      if (Date.now() - lastTouch.current < PAUSE_MS) return;
      const el = scrollerRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({
        left: atEnd ? 0 : el.scrollLeft + stepWidth(),
        behavior: "smooth",
      });
    }, AUTO_MS);

    return () => clearInterval(id);
  }, [stepWidth]);

  return (
    <section className="pb-14 pt-10 sm:pb-20 lg:pt-14">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6">
        {/* Mobile: 1 card. Tablet and small laptops: 2 cards. From 1280px: 3-column grid.
            Below 1280px it swipes automatically. */}
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          onTouchStart={markTouched}
          onPointerDown={markTouched}
          onWheel={markTouched}
          className="relative flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto pb-2 scrollbar-none sm:gap-5 xl:grid xl:snap-none xl:grid-cols-3 xl:gap-6 xl:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          {COLLECTIONS.map((c) => (
            <div
              key={c.title}
              className="w-full shrink-0 snap-start sm:w-[calc(50%-10px)] xl:w-auto"
            >
              <Card c={c} />
            </div>
          ))}
        </div>

        {/* Dots (hidden when the grid is showing) */}
        {positions > 1 && (
          <div
            className="mt-4 flex justify-center gap-2 xl:hidden"
            role="tablist"
            aria-label="Collections"
          >
            {Array.from({ length: positions }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show slide ${i + 1}`}
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
        )}

        {/* Top collections: hidden on mobile */}
        <div className="mt-12 hidden flex-col gap-5 sm:mt-16 sm:flex xl:flex-row xl:items-center xl:gap-10">
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