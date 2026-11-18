import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "Shop", to: "/shop" },
      { label: "Collections", to: "/shop" },
      { label: "Women", to: "/shop?category=women" },
      { label: "Men", to: "/shop?category=men" },
      { label: "Unisex essentials", to: "/shop?category=unisex" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Returns & Exchanges", to: "/about" },
      { label: "Privacy Policy", to: "/about" },
      { label: "Terms & Conditions", to: "/about" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

const linkClass =
  "text-[15px] text-(--black) transition-colors duration-200 hover:text-(--navy) sm:text-[16px]";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: send the email to your newsletter service
    setJoined(true);
    setEmail("");
  };

  return (
    <footer className="border-t border-(--border) bg-(--white)">
      <div className="mx-auto w-full max-w-350 px-5 sm:px-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:py-16 lg:grid-cols-[1.2fr_0.8fr_0.9fr_0.8fr_1.6fr] lg:gap-10 lg:py-20">
          {/* Contact */}
          <div className="col-span-2 space-y-5 lg:col-span-1">
            <p className="flex items-start gap-3 text-[16px] font-medium leading-normal text-(--black)">
              <i
                className="ri-map-pin-2-fill mt-0.5 text-[22px] text-(--navy)"
                aria-hidden="true"
              />
              <span>
                Police Zebra Store,
                <br />
                Accra, Ghana
              </span>
            </p>
            <div className="space-y-2 text-[16px]">
              <a
                href="mailto:care@policezebra.com"
                className="flex items-center gap-3 text-(--black) transition-colors hover:text-(--navy)"
              >
                <i className="ri-mail-line text-[20px] text-(--navy)" aria-hidden="true" />
                care@policezebra.com
              </a>
              <a
                href="tel:+233000000000"
                className="flex items-center gap-3 text-(--grey) transition-colors hover:text-(--navy)"
              >
                <i className="ri-phone-line text-[20px] text-(--navy)" aria-hidden="true" />
                +233 00 000 0000
              </a>
            </div>
          </div>

          {/* Newsletter: second on mobile, last on desktop */}
          <div className="col-span-2 order-2 rounded-xl bg-(--ivory) p-5 sm:p-6 lg:order-last lg:col-span-1 lg:rounded-none lg:bg-transparent lg:p-0">
            <h3 className="text-[22px] font-semibold uppercase leading-tight text-(--black) sm:text-[24px]">
              <span className="font-black text-(--navy)">Get 5% off</span>
              <br />
              your first purchase
            </h3>
            <p className="mt-3 max-w-sm text-[14px] leading-normal text-(--grey)">
              &amp; be the first to know about new arrivals, special offers and
              store news.
            </p>

            {joined ? (
              <p className="mt-5 flex items-center gap-2 text-[15px] font-semibold text-(--navy)">
                <i className="ri-checkbox-circle-fill text-xl" aria-hidden="true" />
                Thanks for joining. Check your inbox.
              </p>
            ) : (
              <form
                onSubmit={onSubmit}
                className="mt-5 flex h-13 items-stretch overflow-hidden rounded-md border border-(--border) bg-(--white) transition-colors duration-200 focus-within:border-(--navy) lg:h-14"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  aria-label="Email address"
                  className="min-w-0 flex-1 bg-transparent px-4 text-[15px] text-(--black) outline-none placeholder:text-(--grey)/70"
                />
                <button
                  type="submit"
                  className="shrink-0 cursor-pointer bg-(--navy) px-6 text-[13px] font-bold uppercase tracking-[0.08em] text-(--white) transition-colors hover:bg-[#061a33] lg:bg-transparent lg:px-5 lg:text-[15px] lg:text-(--navy) lg:hover:bg-transparent lg:hover:text-(--black)"
                >
                  Join
                </button>
              </form>
            )}
          </div>

          {/* Link columns */}
          {COLUMNS.map((col, i) => (
            <nav
              key={col.title}
              aria-label={col.title}
              className={`order-3 lg:order-0 ${
                i === COLUMNS.length - 1 ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              <h3 className="text-[18px] font-semibold uppercase leading-none tracking-[0.01em] text-(--black) sm:text-[20px]">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3 sm:mt-6">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-(--border) py-6 sm:py-7">
          <p className="text-center text-[13px] text-(--grey) sm:text-left sm:text-[15px]">
            &copy; Police Zebra 2026. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;