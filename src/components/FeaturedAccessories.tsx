import { useCallback, useEffect, useRef, useState } from "react";

// Replace with your own photos (rename the files or change the paths)
import mugsImg from "../assets/images/about.png";
import apronsImg from "../assets/images/dunmis.png";
import totesImg from "../assets/images/outfit.png";

const SLIDES = [
  {
    title: "Mugs",
    text: "Your daily brew, made better.",
    image: mugsImg,
    alt: "Police Zebra mugs",
  },
  {
    title: "Aprons",
    text: "Cook, create and clean up in style.",
    image: apronsImg,
    alt: "Police Zebra aprons",
  },
  {
    title: "Tote bags",
    text: "Carry your day with ease.",
    image: totesImg,
    alt: "Police Zebra tote bags",
  },
];

const AUTO_MS = 4000;
const PAUSE_MS = 6000;
const MOBILE_QUERY = "(max-width: 639px)";

const imgClass =
  "absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105";

const labelClass =
  "inline-flex h-12 cursor-default select-none items-center justify-center rounded-md bg-(--black) px-3 text-[13px] font-semibold uppercase tracking-wider text-(--white) sm:h-13 sm:px-7 sm:text-[15px] sm:tracking-[0.06em]";

const FeaturedAccessories = () => {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const lastTouch = useRef(0);
  const [active, setActive] = useState(0);

  const goTo = useCallback((index: number) => {
    const el = scrollerRef.current;
    const child = el?.children[index] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  }, []);

  // Track which slide is showing (also updates when the user swipes)
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

  // Auto-advance on mobile only, one slide at a time, looping back to the first
  useEffect(() => {
    const id = setInterval(() => {
      if (!window.matchMedia(MOBILE_QUERY).matches) return;
      if (Date.now() - lastTouch.current < PAUSE_MS) return;
      goTo((active + 1) % SLIDES.length);
    }, AUTO_MS);

    return () => clearInterval(id);
  }, [active, goTo]);

  return (
    <section className="pb-16 pt-6 sm:pb-20 lg:pb-24">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-x-8">
          {/* Left: heading, labels, large image (image is desktop/tablet only) */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-[28px] font-semibold uppercase leading-none tracking-[0.01em] text-(--black) sm:text-[36px]">
              Made for everyday
            </h2>
            <p className="mt-4 max-w-md text-base leading-normal text-(--grey) sm:text-[17px]">
              Mugs, aprons and tote bags with the Police Zebra touch. Simple
              pieces that make every day feel a little better.
            </p>

            {/* Display-only labels: not links, no hover */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:gap-3.5">
              <span className={labelClass}>Shop mugs</span>
              <span className={labelClass}>Discover totes</span>
            </div>

            <div className="group relative mt-8 hidden aspect-4/3 overflow-hidden rounded-lg bg-(--ivory) sm:block lg:aspect-5/3">
              <img
                src={mugsImg}
                alt="Police Zebra mugs"
                loading="lazy"
                className={imgClass}
              />
            </div>
          </div>

          {/* Mobile: swipeable, auto-scrolling, one slide at a time */}
          <div className="sm:hidden">
            <ul
              ref={scrollerRef}
              onScroll={handleScroll}
              onTouchStart={markTouched}
              onPointerDown={markTouched}
              onWheel={markTouched}
              className="flex snap-x snap-mandatory overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
            >
              {SLIDES.map((s) => (
                <li key={s.title} className="w-full shrink-0 snap-start">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-(--ivory)">
                    <img
                      src={s.image}
                      alt={s.alt}
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover"
                    />
                  </div>
                  <h3 className="mt-5 text-[22px] font-semibold uppercase leading-none tracking-[0.01em] text-(--black)">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 text-base text-(--grey)">{s.text}</p>
                </li>
              ))}
            </ul>

            {/* Dots */}
            <div
              className="mt-5 flex justify-center gap-2"
              role="tablist"
              aria-label="Everyday products"
            >
              {SLIDES.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Show ${s.title}`}
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

          {/* Tablet/desktop: aprons */}
          <article className="hidden sm:block lg:pt-6">
            <div className="group relative aspect-square overflow-hidden rounded-lg bg-(--ivory)">
              <img
                src={apronsImg}
                alt="Police Zebra aprons"
                loading="lazy"
                className={imgClass}
              />
            </div>
            <h3 className="mt-6 text-[22px] font-semibold uppercase leading-none tracking-[0.01em] text-(--black) sm:text-[24px]">
              Aprons
            </h3>
            <p className="mt-2.5 text-base text-(--grey)">
              Cook, create and clean up in style.
            </p>
          </article>

          {/* Tablet/desktop: tote bags */}
          <article className="hidden sm:block">
            <div className="group relative aspect-square overflow-hidden rounded-lg bg-(--ivory)">
              <img
                src={totesImg}
                alt="Police Zebra tote bags"
                loading="lazy"
                className={imgClass}
              />
            </div>
            <h3 className="mt-6 text-[22px] font-semibold uppercase leading-none tracking-[0.01em] text-(--black) sm:text-[24px]">
              Tote bags
            </h3>
            <p className="mt-2.5 text-base text-(--grey)">
              Carry your day with ease.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAccessories;