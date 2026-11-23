import modelImg from "../assets/images/ctaimg.png";

const PERKS = [
  { icon: "ri-truck-line", text: "Fast delivery" },
  { icon: "ri-arrow-go-back-line", text: "Fast returns" },
  { icon: "ri-shield-check-line", text: "Secure payments" },
];

const CTABanner = () => {
  return (
    <section className="pb-12 pt-6 sm:pb-14 lg:pb-16">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-(--navy) sm:min-h-65 lg:min-h-70">

          <div className="relative mx-auto flex h-full w-full max-w-5xl sm:min-h-65 lg:min-h-70">
            <div className="relative z-2 flex flex-col justify-center px-6 py-8 sm:w-[62%] sm:px-8 sm:py-7 lg:w-[60%] lg:px-10 lg:py-8">
              <span className="mb-3 inline-flex items-center gap-2 self-start py-1 text-[10px] font-semibold uppercase tracking-widest text-(--white) sm:text-[11px]">
                <i className="ri-sparkling-2-line" aria-hidden="true" />
                New season is here
              </span>

              <h2 className="flex flex-col font-display text-[clamp(34px,10vw,46px)] leading-[0.95] tracking-[-0.045em] lowercase sm:text-[clamp(36px,5vw,48px)] lg:text-[clamp(40px,4vw,54px)]">
                <span className="font-extrabold text-transparent [-webkit-text-stroke:1.4px_var(--white)] lg:[-webkit-text-stroke:1.6px_var(--white)]">
                  wear it
                </span>
                <span className="font-extrabold text-(--white)">your way</span>
              </h2>

              <p className="mt-3 max-w-md text-[14px] leading-normal text-white sm:text-[15px] sm:leading-[1.55]">
                Clean cuts and easy layers made to be shared. Find the pieces that
                fit your day and make them yours.
              </p>

              {/* Perks */}
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/15 pt-4">
                {PERKS.map((perk) => (
                  <li
                    key={perk.text}
                    className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/80 sm:text-[11px]"
                  >
                    <i className={`${perk.icon} text-sm text-(--white)`} aria-hidden="true" />
                    {perk.text}
                  </li>
                ))}
              </ul>
            </div>

            <img
              src={modelImg}
              alt=""
              loading="lazy"
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-0 hidden h-[94%] w-auto max-w-none object-contain object-bottom-right sm:block lg:right-2 lg:h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;