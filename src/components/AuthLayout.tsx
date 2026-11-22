import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/policelogo.png";

const AuthLayout = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) => (
  <div className="grid min-h-svh bg-(--white) lg:grid-cols-[1fr_1.1fr]">
    {/* Brand panel (desktop only), fixed to the screen height */}
    <aside className="relative hidden flex-col justify-between overflow-hidden bg-(--navy) p-12 lg:sticky lg:top-0 lg:flex lg:h-svh xl:p-16">
      <span
        className="pointer-events-none absolute -right-24 -top-24 size-120 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_70%)]"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -bottom-40 left-1/4 size-120 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_70%)]"
        aria-hidden="true"
      />

      <Link
        to="/"
        className="relative inline-flex items-center gap-2 self-start text-[13px] font-semibold uppercase tracking-[0.12em] text-white/70 transition-colors hover:text-(--white)"
      >
        <i className="ri-arrow-left-line" aria-hidden="true" />
        Back to store
      </Link>

      {/* Sits higher: extra space below it */}
      <div className="relative pb-16 xl:pb-24">
        <h2 className="flex flex-col font-display text-[clamp(48px,5vw,76px)] leading-[0.95] tracking-[-0.045em] lowercase">
          <span className="font-extrabold text-transparent [-webkit-text-stroke:2px_var(--white)]">
            made to
          </span>
          <span className="font-extrabold text-(--white)">be shared</span>
        </h2>
        <p className="mt-4 max-w-md text-lg leading-normal text-white/75">
          Join Police Zebra for faster checkout, order tracking and first
          access to new drops.
        </p>
      </div>
    </aside>

    {/* Form side */}
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4 sm:px-8 lg:px-12">
        <Link
          to="/"
          aria-label="Go to homepage"
          className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-(--grey) transition-colors hover:text-(--navy) lg:hidden"
        >
          <i className="ri-arrow-left-line" aria-hidden="true" />
          Store
        </Link>
        <Link to="/" aria-label="Go to homepage" className="mx-auto lg:ml-0 lg:mr-auto">
          <img src={logo} alt="Police Zebra" className="h-14 w-auto object-contain sm:h-16" />
        </Link>
        <span className="w-14 lg:hidden" aria-hidden="true" />
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-4 sm:px-8 lg:px-12 lg:py-6">
        <div className="w-full max-w-md">
          <h1 className="text-[26px] font-semibold uppercase leading-none tracking-[0.01em] text-(--black) sm:text-[30px]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2.5 text-[15px] leading-normal text-(--grey)">
              {subtitle}
            </p>
          )}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  </div>
);

export default AuthLayout;