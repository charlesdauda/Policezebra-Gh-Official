import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { Link } from "react-router-dom";
import { PRODUCT_BY_ID, POPULAR_IDS } from "../data/products";

interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
}

// Built from the shared product list, so ids and prices always match the shop
const PRODUCTS: Product[] = POPULAR_IDS.map((id) => {
  const p = PRODUCT_BY_ID[id];
  return {
    id: p.id,
    brand: p.brand,
    name: p.name,
    price: p.ghs,
    oldPrice: p.oldGhs,
    image: p.image,
    badge: p.badge,
  };
});

const AUTO_MS = 4000;
const PAUSE_MS = 6000;
const TAP_QUERY = "(max-width: 1023px)"; // below the desktop (lg) breakpoint

const money = (n: number) => `GH₵${n.toFixed(2)}`;

// Left position of a card inside the scrolling track
const cardLeft = (el: HTMLDivElement, index: number) => {
  const child = el.children[index] as HTMLElement | undefined;
  if (!child) return 0;
  return (
    child.getBoundingClientRect().left -
    el.getBoundingClientRect().left +
    el.scrollLeft
  );
};

/* ---------- Card ---------- */
const ProductCard = ({
  p,
  open,
  onToggle,
  onQuickView,
}: {
  p: Product;
  open: boolean;
  onToggle: () => void;
  onQuickView: (p: Product) => void;
}) => (
  <article
    data-card
    data-open={open}
    onClick={onToggle}
    className="group relative overflow-hidden rounded-lg bg-(--white) transition-shadow duration-300 data-[open=true]:shadow-[0_24px_50px_-20px_rgba(11,41,77,0.35)] lg:hover:shadow-[0_24px_50px_-20px_rgba(11,41,77,0.35)] lg:focus-within:shadow-[0_24px_50px_-20px_rgba(11,41,77,0.35)]"
  >
    {/* Image */}
    <div className="relative aspect-3/4 overflow-hidden bg-(--ivory)">
      <img
        src={p.image}
        alt={p.name}
        loading="lazy"
        className="size-full object-cover"
      />

      {p.badge && (
        <span className="absolute left-4 top-4 bg-(--white) px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-(--black)">
          {p.badge}
        </span>
      )}

      {/* Quickview: appears on hover (desktop) or when the card is tapped open */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onQuickView(p);
        }}
        className="pointer-events-none absolute bottom-0 right-0 z-10 translate-y-2 bg-(--white) px-5 py-3.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-(--black) opacity-0 transition-all duration-300 hover:bg-(--navy) hover:text-(--white) focus-visible:translate-y-0 focus-visible:opacity-100 group-data-[open=true]:pointer-events-auto group-data-[open=true]:translate-y-0 group-data-[open=true]:opacity-100 sm:px-6 sm:py-4 sm:text-[14px] lg:group-hover:pointer-events-auto lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
      >
        Quickview
      </button>
    </div>

    {/* Info panel */}
    <div className="relative z-1 rounded-t-lg bg-(--white) p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-(--grey)">
        {p.brand}
      </p>
      <h3 className="mt-2.5 text-[17px] leading-snug text-(--black)">{p.name}</h3>

      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        {p.oldPrice && (
          <span className="text-[15px] text-(--grey) line-through">
            {money(p.oldPrice)}
          </span>
        )}
        <span className="text-[15px] font-semibold text-(--black)">
          {money(p.price)}
        </span>
        {p.oldPrice && (
          <span className="bg-(--navy) px-2 py-0.5 text-[11px] font-bold text-(--white)">
            Save {money(p.oldPrice - p.price)}
          </span>
        )}
      </div>
    </div>
  </article>
);

/* ---------- Quickview modal ---------- */
const QuickView = ({ p, onClose }: { p: Product; onClose: () => void }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-110 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[3px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={p.name}
    >
      <div
        className="relative grid max-h-[88svh] w-full max-w-sm grid-cols-[140px_1fr] overflow-hidden rounded-xl bg-(--white) shadow-2xl sm:max-w-3xl sm:grid-cols-2 sm:overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quickview"
          className="absolute right-2 top-2 z-10 flex size-9 items-center justify-center rounded-full bg-(--white) text-[20px] text-(--black) shadow transition-colors hover:bg-black/10 sm:right-3 sm:top-3 sm:size-10 sm:text-[22px]"
        >
          <i className="ri-close-line" />
        </button>

        <img
          src={p.image}
          alt={p.name}
          className="size-full min-h-52 object-cover sm:aspect-3/4"
        />

        <div className="flex flex-col justify-center p-5 pr-5 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-(--grey)">
            {p.brand}
          </p>
          <h3 className="mt-2 pr-6 text-[19px] font-semibold uppercase leading-tight text-(--black) sm:mt-3 sm:pr-0 sm:text-[26px]">
            {p.name}
          </h3>
          <div className="mt-2.5 flex items-center gap-2 sm:mt-4 sm:gap-3">
            {p.oldPrice && (
              <span className="text-[14px] text-(--grey) line-through sm:text-[16px]">
                {money(p.oldPrice)}
              </span>
            )}
            <span className="text-[17px] font-semibold text-(--black) sm:text-[20px]">
              {money(p.price)}
            </span>
          </div>
          <p className="mt-4 hidden text-[15px] leading-normal text-(--grey) sm:block">
            Clean cuts and easy layers made to be shared. Choose your size and
            colour on the product page.
          </p>
          <Link
            to={`/shop/${p.id}`}
            onClick={onClose}
            className="group mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-(--navy) px-4 text-[13px] font-semibold uppercase tracking-wider text-(--white) transition-colors hover:bg-[#061a33] sm:mt-6 sm:h-13 sm:gap-2.5 sm:px-7 sm:text-[15px] sm:tracking-[0.06em]"
          >
            Select options
            <i className="ri-arrow-right-line transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ---------- Section ---------- */
const PopularProducts = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const lastTouch = useRef(0);
  const [quick, setQuick] = useState<Product | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  // Go to the next card, or back to the first after the last one
  const advance = useCallback(() => {
    const el = trackRef.current;
    if (!el || el.children.length === 0) return;

    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    if (atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    // Find the card currently at the left edge, then move to the one after it
    let current = 0;
    let best = Infinity;
    for (let i = 0; i < el.children.length; i++) {
      const dist = Math.abs(cardLeft(el, i) - el.scrollLeft);
      if (dist < best) {
        best = dist;
        current = i;
      }
    }

    const next = Math.min(current + 1, el.children.length - 1);
    el.scrollTo({ left: cardLeft(el, next), behavior: "smooth" });
  }, []);

  const markTouched = () => {
    lastTouch.current = Date.now();
  };

  // Tap a card to open/close it (mobile and tablet; desktop uses real hover)
  const toggleCard = (id: string) => {
    if (!window.matchMedia(TAP_QUERY).matches) return;
    setOpenId((cur) => (cur === id ? null : id));
  };

  // Only a real mouse counts as "hovering" (touch screens fake mouse events)
  const onPointerEnter = (e: PointerEvent) => {
    if (e.pointerType === "mouse") hovering.current = true;
  };
  const onPointerLeave = (e: PointerEvent) => {
    if (e.pointerType === "mouse") hovering.current = false;
  };

  // Tapping anywhere outside a card closes the open one
  useEffect(() => {
    if (!openId) return;
    const onDown = (e: globalThis.PointerEvent) => {
      if (!(e.target as HTMLElement).closest("[data-card]")) setOpenId(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [openId]);

  // Auto-advance one card at a time. Paused while hovering, after touching,
  // or while a card / quickview is open.
  useEffect(() => {
    const id = setInterval(() => {
      if (hovering.current || quick || openId) return;
      if (Date.now() - lastTouch.current < PAUSE_MS) return;
      advance();
    }, AUTO_MS);

    return () => clearInterval(id);
  }, [quick, openId, advance]);

  return (
    <section className="pb-16 pt-6 sm:pb-20 lg:pb-24">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6">
        {/* Heading */}
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="text-[26px] font-semibold uppercase leading-none tracking-[0.01em] text-(--black) sm:text-[32px]">
            Popular right now
          </h2>
          <Link
            to="/shop"
            className="mt-4 inline-block border-b-2 border-(--navy) pb-0.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-(--black) transition-colors hover:text-(--navy)"
          >
            Shop latest
          </Link>
        </div>

        {/* Carousel */}
        <div onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
          <div
            ref={trackRef}
            onTouchStart={markTouched}
            onPointerDown={markTouched}
            onWheel={markTouched}
            className="-my-8 flex snap-x snap-mandatory gap-5 overflow-x-auto py-8 scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {PRODUCTS.map((p) => (
              <div
                key={p.id}
                className="w-[72%] shrink-0 snap-start sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
              >
                <ProductCard
                  p={p}
                  open={openId === p.id}
                  onToggle={() => toggleCard(p.id)}
                  onQuickView={setQuick}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {quick && <QuickView p={quick} onClose={() => setQuick(null)} />}
    </section>
  );
};

export default PopularProducts;