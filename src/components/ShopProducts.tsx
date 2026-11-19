import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ALL_PRODUCTS,
  CATEGORIES,
  eurFmt,
  ghsFmt,
  type Product,
} from "../data/products";

const ALL_ID = "all";

type SortKey = "newest" | "price-low" | "price-high" | "name";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

/* ---------- Product card ---------- */
const ProductCard = ({ p }: { p: Product }) => (
  <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-(--border) bg-(--white) transition-colors duration-300 hover:border-(--navy)/35">
    <div className="relative aspect-square overflow-hidden bg-(--ivory)">
      <img
        src={p.image}
        alt={p.name}
        loading="lazy"
        className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {p.badge && (
        <span className="absolute left-3 top-3 bg-(--white) px-2 py-1 text-[10px] font-bold uppercase tracking-[0.04em] text-(--black) sm:left-4 sm:top-4 sm:px-2.5 sm:text-[11px]">
          {p.badge}
        </span>
      )}
    </div>

    <div className="flex flex-1 flex-col p-3.5 sm:p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-(--grey) sm:text-[11px]">
        {p.category}
      </p>
      <h3 className="mt-1.5 text-[16px] font-semibold leading-tight text-(--black) sm:text-[19px]">
        {p.name}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-[13px] leading-normal text-(--grey) sm:mt-2 sm:text-[14px]">
        {p.description}
      </p>

      <div className="mt-auto flex flex-col gap-3 pt-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:pt-5">
        <div>
          <p className="flex flex-wrap items-baseline gap-x-2 text-[17px] font-semibold leading-none text-(--black) sm:text-[19px]">
            {ghsFmt(p.ghs)}
            {p.oldGhs && (
              <span className="text-[12px] font-normal text-(--grey) line-through sm:text-[13px]">
                {ghsFmt(p.oldGhs)}
              </span>
            )}
          </p>
          <p className="mt-1.5 text-[12px] leading-none text-(--grey) sm:text-[13px]">
            {eurFmt(p.eur)}
          </p>
        </div>

        <Link
          to={`/shop/${p.id}`}
          aria-label={`Select options for ${p.name}`}
          className="inline-flex h-10 w-full items-center justify-center rounded-md border-[1.5px] border-(--navy) px-5 text-[13px] font-semibold uppercase tracking-[0.06em] text-(--navy) transition-colors duration-200 hover:bg-(--navy) hover:text-(--white) sm:w-auto"
        >
          Select
        </Link>
      </div>
    </div>
  </article>
);

/* ---------- Section ---------- */
const ShopProducts = () => {
  const [activeId, setActiveId] = useState(ALL_ID);
  const [sort, setSort] = useState<SortKey>("newest");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeLabel =
    activeId === ALL_ID
      ? "All"
      : CATEGORIES.find((c) => c.id === activeId)?.label ?? "All";

  const visible = useMemo(() => {
    const base =
      activeId === ALL_ID
        ? ALL_PRODUCTS
        : CATEGORIES.find((c) => c.id === activeId)?.products ?? [];
    const list = [...base];

    if (sort === "price-low") list.sort((a, b) => a.ghs - b.ghs);
    else if (sort === "price-high") list.sort((a, b) => b.ghs - a.ghs);
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [activeId, sort]);

  // Close the mobile dropdown on outside tap or Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const choose = (id: string) => {
    setActiveId(id);
    setMenuOpen(false);
  };

  const options = [
    { id: ALL_ID, label: "All" },
    ...CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
  ];

  return (
    <section className="pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[250px_1fr] lg:gap-12">
          {/* ---------- Categories ---------- */}
          <aside>
            {/* Mobile and tablet: dropdown */}
            <div ref={menuRef} className="relative lg:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-haspopup="listbox"
                className="flex h-14 w-full cursor-pointer items-center justify-between rounded-lg border border-(--border) bg-(--white) px-4 text-left text-[16px] transition-colors focus-visible:border-(--navy)"
              >
                <span>
                  <span className="font-semibold text-(--black)">Category: </span>
                  <span className="text-(--grey)">{activeLabel}</span>
                </span>
                <i
                  className={`ri-arrow-down-s-line text-[22px] text-(--grey) transition-transform duration-300 ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {menuOpen && (
                <ul
                  role="listbox"
                  aria-label="Categories"
                  className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-y-auto overflow-x-hidden rounded-lg border border-(--border) bg-(--white) shadow-[0_24px_50px_-20px_rgba(11,41,77,0.35)]"
                >
                  {options.map((o) => (
                    <li key={o.id} role="option" aria-selected={o.id === activeId}>
                      <button
                        type="button"
                        onClick={() => choose(o.id)}
                        className={`w-full cursor-pointer border-b border-(--border) px-4 py-4 text-left text-[16px] transition-colors last:border-b-0 ${
                          o.id === activeId
                            ? "bg-(--navy) font-semibold text-(--white)"
                            : "text-(--grey) hover:bg-(--ivory) hover:text-(--black)"
                        }`}
                      >
                        {o.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Desktop: sticky list */}
            <nav aria-label="Categories" className="hidden lg:sticky lg:top-40 lg:block">
              <span className="mb-4 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-(--black)">
                <span className="h-px w-8 bg-(--navy)" aria-hidden="true" />
                Category
              </span>
              <ul className="overflow-hidden rounded-lg border border-(--border) bg-(--white)">
                {options.map((o) => (
                  <li key={o.id} className="border-b border-(--border) last:border-b-0">
                    <button
                      type="button"
                      onClick={() => choose(o.id)}
                      aria-current={o.id === activeId ? "true" : undefined}
                      className={`w-full cursor-pointer px-5 py-3.5 text-left text-[16px] transition-colors duration-200 ${
                        o.id === activeId
                          ? "bg-(--navy) font-semibold text-(--white)"
                          : "text-(--grey) hover:bg-(--ivory) hover:text-(--black)"
                      }`}
                    >
                      {o.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* ---------- Products ---------- */}
          <div>
            <div className="mb-5 flex items-center justify-between gap-4 sm:mb-7">
              <p className="text-[14px] text-(--grey)" aria-live="polite">
                <span className="font-semibold text-(--black)">{visible.length}</span>{" "}
                {visible.length === 1 ? "product" : "products"}
              </p>

              <label className="flex items-center gap-3 text-[14px] text-(--grey)">
                Sort by
                <span className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="h-10 cursor-pointer appearance-none border-b border-(--border) bg-transparent pr-8 text-[15px] font-medium text-(--black) outline-none transition-colors focus:border-(--navy)"
                  >
                    {SORT_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <i
                    className="ri-arrow-down-s-line pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[20px] text-(--black)"
                    aria-hidden="true"
                  />
                </span>
              </label>
            </div>

            {visible.length === 0 ? (
              <p className="rounded-lg border border-(--border) bg-(--white) px-6 py-14 text-center text-(--grey)">
                No products in this category yet.
              </p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                {visible.map((p) => (
                  <li key={p.id}>
                    <ProductCard p={p} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopProducts;