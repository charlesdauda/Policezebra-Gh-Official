// Uses your existing hero image. Swap for any transparent PNG you like.
import modelImg from "../assets/images/manhero.png";

const PERKS = [
  { icon: "ri-truck-line", text: "Fast delivery" },
  { icon: "ri-arrow-go-back-line", text: "14-days returns" },
  { icon: "ri-shield-check-line", text: "Secure payments" },
];

const CTABanner = () => {
  return (
    <section className="pb-16 pt-6 sm:pb-20 lg:pb-24">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-(--navy) sm:min-h-105 lg:min-h-120">
          {/* Soft glows */}
          <span
            className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_70%)]"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute -bottom-32 left-1/4 size-96 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07),transparent_70%)]"
            aria-hidden="true"
          />

          {/* Copy */}
          <div className="relative z-2 flex flex-col px-6 py-12 sm:w-[62%] sm:px-10 sm:py-14 lg:w-[58%] lg:px-16 lg:py-16">
            <span className="mb-5 inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-(--white) sm:text-[12px]">
              <i className="ri-sparkling-2-line" aria-hidden="true" />
              New season is here
            </span>

            <h2 className="flex flex-col font-display text-[clamp(44px,12vw,64px)] leading-[0.95] tracking-[-0.045em] lowercase sm:text-[clamp(48px,7vw,76px)] lg:text-[clamp(56px,6vw,92px)]">
              <span className="font-extrabold text-transparent [-webkit-text-stroke:1.8px_var(--white)] lg:[-webkit-text-stroke:2px_var(--white)]">
                wear it
              </span>
              <span className="font-extrabold text-(--white)">your way</span>
            </h2>

            <p className="mt-5 max-w-md text-base leading-normal text-white/75 sm:text-[17px] sm:leading-[1.6] lg:text-lg">
              Clean cuts and easy layers made to be shared. Find the pieces that
              fit your day and make them yours.
            </p>

            {/* Perks */}
            <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/15 pt-6">
              {PERKS.map((perk) => (
                <li
                  key={perk.text}
                  className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-white/80 sm:text-[13px]"
                >
                  <i className={`${perk.icon} text-lg text-(--white)`} aria-hidden="true" />
                  {perk.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Image: tablet and desktop only */}
          <img
            src={modelImg}
            alt=""
            loading="lazy"
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-[-2%] hidden h-[70%] w-auto max-w-none object-contain object-bottom-right sm:block lg:right-0 lg:h-[88%]"
          />
        </div>
      </div>
    </section>
  );
};

export default CTABanner;