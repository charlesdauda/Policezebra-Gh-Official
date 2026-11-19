import { useCallback, useEffect, useRef, useState } from "react";

const CHANNELS = [
  {
    label: "Phone",
    handle: "+233 00 000 0000",
    icon: "ri-phone-line",
    href: "tel:+233000000000",
  },
  {
    label: "WhatsApp",
    handle: "Chat with us",
    icon: "ri-whatsapp-line",
    href: "https://wa.me/233000000000",
  },
  {
    label: "Instagram",
    handle: "@policezebra",
    icon: "ri-instagram-line",
    href: "https://instagram.com/policezebra",
  },
  {
    label: "Facebook",
    handle: "Police Zebra",
    icon: "ri-facebook-fill",
    href: "https://facebook.com/policezebra",
  },
  {
    label: "TikTok",
    handle: "@policezebra",
    icon: "ri-tiktok-fill",
    href: "https://tiktok.com/@policezebra",
  },
];

const AUTO_MS = 4000;
const PAUSE_MS = 6000;
const MOBILE_QUERY = "(max-width: 767px)";

const ContactConnect = () => {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const lastTouch = useRef(0);
  const [active, setActive] = useState(0);

  const goTo = useCallback((index: number) => {
    const el = scrollerRef.current;
    const child = el?.children[index] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  }, []);

  // Track which tile is showing (also updates when the user swipes)
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

  // Auto-advance on mobile only, one tile at a time, looping back to the first
  useEffect(() => {
    const id = setInterval(() => {
      if (!window.matchMedia(MOBILE_QUERY).matches) return;
      if (Date.now() - lastTouch.current < PAUSE_MS) return;
      goTo((active + 1) % CHANNELS.length);
    }, AUTO_MS);

    return () => clearInterval(id);
  }, [active, goTo]);

  return (
    <section className="pb-16 sm:pb-20 lg:pb-24">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-(--black)">
            <span className="h-px w-8 bg-(--navy)" aria-hidden="true" />
            Stay connected
            <span className="h-px w-8 bg-(--navy)" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-[28px] font-semibold uppercase leading-none tracking-[0.01em] text-(--black) sm:text-[36px]">
            Reach us anywhere
          </h2>
          <p className="mt-4 text-base leading-normal text-(--grey) sm:text-[17px]">
            Call, message or follow us. We usually reply fast.
          </p>
        </div>

        {/* Mobile: one tile at a time, auto-scrolling. Tablet/desktop: grid */}
        <ul
          ref={scrollerRef}
          onScroll={handleScroll}
          onTouchStart={markTouched}
          onPointerDown={markTouched}
          onWheel={markTouched}
          className="mt-10 flex snap-x snap-mandatory overflow-x-auto scrollbar-none sm:mt-12 md:grid md:snap-none md:grid-cols-3 md:gap-5 md:overflow-visible lg:grid-cols-5 [&::-webkit-scrollbar]:hidden"
        >
          {CHANNELS.map((c) => (
            <li key={c.label} className="w-full shrink-0 snap-start md:w-auto">
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                aria-label={`${c.label}: ${c.handle}`}
                className="flex h-full flex-col items-center rounded-xl border border-(--border) bg-(--white) px-4 py-7 text-center transition-colors duration-300 hover:border-(--navy)/35 sm:py-8"
              >
                <i
                  className={`${c.icon} block text-[36px] leading-none text-(--navy)`}
                  aria-hidden="true"
                />
                <span className="mt-4 text-[15px] font-semibold uppercase tracking-[0.06em] text-(--black)">
                  {c.label}
                </span>
                <span className="mt-1 text-[14px] text-(--grey)">{c.handle}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile dots */}
        <div
          className="mt-5 flex justify-center gap-2 md:hidden"
          role="tablist"
          aria-label="Contact channels"
        >
          {CHANNELS.map((c, i) => (
            <button
              key={c.label}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show ${c.label}`}
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

export default ContactConnect;