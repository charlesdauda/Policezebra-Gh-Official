import { useCallback, useEffect, useRef, useState } from "react";

const LOCATIONS = [
  {
    region: "Germany",
    city: "Berlin",
    lines: ["Berlin, Germany"]
  },
  {
    region: "Thailand",
    city: "Bangkok",
    lines: ["Bangkok, Thailand"],
  },
  {
    region: "Ghana",
    city: "Accra",
    lines: ["Accra, Ghana"],
  },
];

const AUTO_MS = 4000;
const PAUSE_MS = 6000;
const MOBILE_QUERY = "(max-width: 767px)";

const ContactLocations = () => {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const lastTouch = useRef(0);
  const [active, setActive] = useState(0);

  const goTo = useCallback((index: number) => {
    const el = scrollerRef.current;
    const child = el?.children[index] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  }, []);

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

  // Auto-advance on mobile only, one card at a time, looping back to the first
  useEffect(() => {
    const id = setInterval(() => {
      if (!window.matchMedia(MOBILE_QUERY).matches) return;
      if (Date.now() - lastTouch.current < PAUSE_MS) return;
      goTo((active + 1) % LOCATIONS.length);
    }, AUTO_MS);

    return () => clearInterval(id);
  }, [active, goTo]);

  return (
    <section className="pb-14 pt-14 sm:pb-20 sm:pt-20">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-(--black)">
            <span className="h-px w-8 bg-(--navy)" aria-hidden="true" />
            Our locations
            <span className="h-px w-8 bg-(--navy)" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-[28px] font-semibold uppercase leading-none tracking-[0.01em] text-(--black) sm:text-[36px]">
            Find us around the world
          </h2>
          <p className="mt-4 text-base leading-normal text-(--grey) sm:text-[17px]">
            Police Zebra has offices in three countries. Visit us or reach out
            to the one closest to you.
          </p>
        </div>

        <ul
          ref={scrollerRef}
          onScroll={handleScroll}
          onTouchStart={markTouched}
          onPointerDown={markTouched}
          onWheel={markTouched}
          className="mx-auto mt-8 flex max-w-5xl snap-x snap-mandatory overflow-x-auto scrollbar-none sm:mt-10 md:grid md:snap-none md:grid-cols-3 md:gap-4 md:overflow-visible lg:gap-5 [&::-webkit-scrollbar]:hidden"
        >
          {LOCATIONS.map((l) => (
            <li key={l.city} className="w-full shrink-0 snap-start md:w-auto">
              <div className="h-full rounded-xl border border-(--border) bg-(--white) p-5 transition-colors duration-300 hover:border-(--navy)/35">
                <i
                  className="ri-map-pin-2-line block text-[26px] leading-none text-(--navy)"
                  aria-hidden="true"
                />
                <p className="mt-3.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-(--grey)">
                  {l.region}
                </p>
                <h3 className="mt-1 text-[19px] font-semibold uppercase leading-tight tracking-[0.01em] text-(--black)">
                  {l.city}
                </h3>

                <address className="mt-3 text-[14px] not-italic leading-normal text-(--grey)">
                  {l.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>
            </li>
          ))}
        </ul>

        {/* Mobile dots */}
        <div
          className="mt-5 flex justify-center gap-2 md:hidden"
          role="tablist"
          aria-label="Our locations"
        >
          {LOCATIONS.map((l, i) => (
            <button
              key={l.city}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show ${l.city}`}
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
    </section>
  );
};

export default ContactLocations;