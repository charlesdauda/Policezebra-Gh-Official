import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import maleImg from "../assets/images/manhero.png";
import femaleImg from "../assets/images/womanhero.png";

const SLIDES = [
  {
    src: maleImg,
    alt: "Model wearing a Police Zebra tee from the new season collection",
  },
  {
    src: femaleImg,
    alt: "Model wearing a Police Zebra tee from the new season collection",
  },
];

const STORY_URL = "https://youtu.be/G5hbAaIJH_8?si=Bax0o52gqtdU6tXQ";

const Hero = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="pt-4 pb-8 sm:pt-6 sm:pb-12 xl:pt-8 xl:pb-14">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6">
        {/* Below xl: centred text only. From xl: copy column + image column, never overlapping */}
        <div className="relative overflow-hidden xl:grid xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-center">
          {/* Copy */}
          <div className="@container relative z-2 flex flex-col items-center justify-center py-6 text-center sm:px-2 sm:py-10 xl:items-start xl:px-6 xl:py-10 xl:text-left">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-(--white) px-3 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] sm:mb-5 sm:px-3.5 sm:py-1.75 sm:text-[13px]">
              <i className="ri-sparkling-2-line text-(--navy)" aria-hidden="true" />
              New 2026 Collection Live Now
            </span>

            <h1 className="flex flex-wrap justify-center gap-x-3 font-display text-[clamp(44px,14vw,68px)] leading-[0.95] tracking-[-0.045em] sm:text-[clamp(56px,9vw,84px)] xl:justify-start xl:text-[clamp(36px,15cqw,104px)]">
              <span className="font-extrabold text-transparent [-webkit-text-stroke:1.8px_var(--navy)] lg:[-webkit-text-stroke:2px_var(--navy)]">
                Latest
              </span>
              <span className="font-extrabold text-(--navy)">Drop</span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-normal text-(--grey) sm:mt-5 sm:text-[17px] sm:leading-[1.55] xl:max-w-none xl:text-lg">
              Fresh arrivals, distinctive details and effortless style made for
              every moment. Explore the latest unisex staples alongside dedicated
              menswear and womenswear, thoughtfully selected to keep you looking
              sharp from morning to midnight.
            </p>

            {/* Buttons: side by side on mobile, inline from tablet up */}
            <div className="mt-6 grid w-full max-w-md grid-cols-2 gap-3 sm:mt-7 sm:flex sm:w-auto sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-3 xl:justify-start">
              <Link
                to="/shop"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-(--navy) px-3 text-[13px] font-semibold uppercase tracking-wider text-(--white) transition-colors duration-200 hover:bg-[#061a33] sm:h-13 sm:gap-2.5 sm:px-7 sm:text-[15px] sm:tracking-[0.06em]"
              >
                <span className="sm:hidden">Shop now</span>
                <span className="hidden sm:inline">Shop collection</span>
                <i className="ri-arrow-right-line transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <a
                href={STORY_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-md border-[1.5px] border-(--navy) px-3 text-[13px] font-semibold uppercase tracking-wider sm:h-13 sm:px-7 sm:text-[15px] sm:tracking-[0.06em]"
              >
                Our story
              </a>
            </div>
          </div>

          {/* Image column: large screens only (xl and up).
              Its height comes from a fixed aspect ratio, capped so it never gets too tall. */}
          <div className="relative hidden aspect-5/4 max-h-130 w-full xl:block">
            {SLIDES.map((s, i) => (
              <img
                key={i}
                src={s.src}
                alt={s.alt}
                className={`pointer-events-none absolute inset-0 size-full object-contain object-bottom-right transition-all duration-1000 ease-in-out ${
                  i === active
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-2.5 scale-[1.03] opacity-0"
                }`}
                loading={i === 0 ? "eager" : "lazy"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;