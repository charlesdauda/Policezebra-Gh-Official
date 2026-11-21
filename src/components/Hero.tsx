import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import maleImg from "../assets/images/manhero.png";
import femaleImg from "../assets/images/womanhero.png";

const SLIDES = [
  {
    src: maleImg,
    alt: "Model wearing a Police Zebra tee from the new season collection",
    scale: 1,
  },
  {
    src: femaleImg,
    alt: "Model wearing a Police Zebra tee from the new season collection",
    scale: 1,
  },
];

const Hero = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="pt-4 pb-6 sm:pt-7 sm:pb-12 lg:pb-14">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6">
        {/* Panel */}
        <div className="relative overflow-hidden max-sm:flex max-sm:min-h-[calc(100svh-215px)] max-sm:flex-col max-sm:justify-center sm:h-[clamp(520px,calc(100svh-230px),680px)] lg:h-[clamp(600px,calc(100svh-190px),780px)]">
          {/* Copy */}
          <div className="relative z-2 flex flex-col py-6 sm:h-full sm:w-[56%] sm:justify-end sm:px-6 sm:pb-14 sm:pt-0 lg:w-[58%] lg:pb-28">
            <span className="mb-4 inline-flex items-center gap-2 self-start rounded-full bg-(--white) px-3 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] sm:mb-5 sm:px-3.5 sm:py-1.75 sm:text-[13px]">
              <i className="ri-sparkling-2-line text-(--navy)" aria-hidden="true" />
             New 2026 Collection Live Now
            </span>

            <h1 className="flex font-display text-[clamp(44px,14vw,68px)] leading-[0.95] tracking-[-0.045em] space-x-3 sm:text-[clamp(52px,8vw,72px)] lg:text-[clamp(56px,6.4vw,100px)]">
              <span className="font-extrabold text-transparent [-webkit-text-stroke:1.8px_var(--navy)] lg:[-webkit-text-stroke:2px_var(--navy)]">
                Latest
              </span>
              <span className="font-extrabold text-(--navy)">Drop</span>
            </h1>

            <p className="mt-4 max-w-none text-base leading-normal text-(--grey) sm:mt-5 sm:max-w-85 sm:text-[17px] sm:leading-[1.55] lg:mt-5.5 lg:max-w-117.5 lg:text-lg">
             Fresh arrivals, distinctive details and effortless style made for every moment. 
             Explore the latest unisex staples alongside dedicated menswear and womenswear, 
             thoughtfully selected to keep you looking sharp from morning to midnight.
            </p>

            {/* Buttons: left and right on mobile, inline on larger screens */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7 sm:flex sm:flex-wrap sm:gap-3.5">
              <Link
                to="/shop"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-(--navy) px-3 text-[13px] font-semibold uppercase tracking-wider text-(--white) transition-colors duration-200 hover:bg-[#061a33] sm:h-13 sm:gap-2.5 sm:px-7 sm:text-[15px] sm:tracking-[0.06em]"
              >
                <span className="sm:hidden">Shop now</span>
                <span className="hidden sm:inline">Shop collection</span>
                <i className="ri-arrow-right-line transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/https://youtu.be/G5hbAaIJH_8?si=Bax0o52gqtdU6tXQ"
                className="inline-flex h-12 items-center justify-center rounded-md border-[1.5px] border-(--navy) px-3 text-[13px] font-semibold uppercase tracking-wider sm:h-13 sm:px-7 sm:text-[15px] sm:tracking-[0.06em]"
              >
                Our story
              </Link>
            </div>
          </div>

          {/* Image stage: hidden on mobile, right side on tablet and desktop */}
          <div className="absolute inset-0 z-1 max-sm:hidden">
            {SLIDES.map((s, i) => (
              <img
                key={i}
                src={s.src}
                alt={s.alt}
                style={{ "--h": `${s.scale * 100}%` } as CSSProperties}
                className={`pointer-events-none absolute bottom-0 right-[-5%] h-[calc(var(--h)*0.82)] w-auto max-w-none origin-bottom-right object-contain object-bottom-right transition-all duration-1000 ease-in-out lg:h-(--h) ${
                  i === active
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-2.5 scale-[1.04] opacity-0"
                }`}
                loading={i === 0 ? "eager" : "lazy"}
              />
            ))}

            {/* Dots */}
            <div
              className="absolute bottom-6.5 right-8 z-3 flex gap-2"
              role="tablist"
              aria-label="Hero images"
            >
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Show image ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                    i === active ? "w-7 bg-(--black)" : "w-2 bg-black/25"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;