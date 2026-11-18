import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import TopBar from "./TopBar";
import logo from "../assets/images/policelogo.png";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Contact", to: "/contact" },
];

interface HeaderProps {
  cartCount?: number;
}

const iconBtn =
  "relative w-11 h-11 rounded-full inline-flex items-center justify-center text-[22px] text-[var(--black)] transition-colors duration-200 hover:bg-black/10";

const Header = ({ cartCount = 0 }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // lock scroll when the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* TopBar + header stick together */}
      <div className="sticky top-0 z-50">
        <TopBar />

        <header className="bg-(--white) text-(--black) border-b border-(--border)">
          {/* 3 real grid children: left | logo | right */}
          <div className="w-full max-w-350 mx-auto px-6 max-[900px]:px-4 h-24 max-[900px]:h-17 grid grid-cols-[1fr_auto_1fr] items-center">
            {/* Left: burger (mobile) / nav (desktop) */}
            <div className="flex items-stretch h-full justify-self-start">
              <button
                className={`${iconBtn} self-center -ml-2.5 min-[901px]:hidden`}
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
              >
                <i className="ri-menu-3-line" />
              </button>

              <nav className="hidden min-[901px]:flex h-full" aria-label="Main navigation">
                {LINKS.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      `relative flex items-center px-7 max-lg:px-4.5 text-[17px] font-semibold uppercase tracking-[0.04em] transition-colors duration-200 hover:text-black after:content-[''] after:absolute after:left-7 after:right-7 max-lg:after:left-4.5 max-lg:after:right-4.5 after:bottom-4 after:h-0.75 after:bg-(--navy) after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                        isActive
                          ? "text-black after:scale-x-100"
                          : "text-black/85 after:scale-x-0"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Center: logo */}
            <Link to="/" className="flex items-center justify-center px-4" aria-label="Go to homepage">
              <img
                className="h-20 w-auto object-contain max-[900px]:h-14"
                src={logo}
                alt="Brand logo"
              />
            </Link>

            {/* Right: cart, account */}
            <div className="flex items-center justify-end gap-4 max-[900px]:gap-1 justify-self-end">
              <Link to="/cart" className={iconBtn} aria-label="Cart">
                <i className="ri-shopping-bag-3-line" />
                <span className="absolute top-1 right-0.5 min-w-4.5 h-4.5 px-1.25 rounded-[9px] bg-(--navy) text-(--white) text-[11px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              </Link>

              <Link to="/account" className={iconBtn} aria-label="Account">
                <i className="ri-user-3-line" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-90 bg-black/[0.55] backdrop-blur-[3px] transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <aside
        className={`fixed top-0 left-0 bottom-0 z-100 w-[min(86vw,360px)] bg-white flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile menu"
      >
        <div className="flex items-center justify-between px-5 py-4 bg-white">
          <img className="h-9 w-auto" src={logo} alt="Brand logo" />
          <button className={iconBtn} aria-label="Close menu" onClick={closeMenu}>
            <i className="ri-close-line" />
          </button>
        </div>

        <nav className="flex-1 px-5 py-3 overflow-y-auto">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center py-5 border-b border-(--border) text-[22px] font-semibold uppercase tracking-[0.03em] ${
                  isActive ? "text-(--navy)" : ""
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-5 border-t border-(--border)">
          <Link
            to="/account"
            onClick={closeMenu}
            className="inline-flex items-center justify-center gap-2.5 h-13 px-7 rounded-md bg-(--black) text-(--white) font-semibold text-[15px] tracking-[0.06em] uppercase transition-colors duration-200 hover:bg-(--navy) w-full"
          >
            <i className="ri-user-3-line" /> My Account
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Header;