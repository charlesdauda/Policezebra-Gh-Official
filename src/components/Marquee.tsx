const ITEMS = [
  { icon: "ri-truck-line", text: "Fast delivery nationwide" },
  { icon: "ri-arrow-go-back-line", text: "Easy 14-day returns" },
  { icon: "ri-shirt-line", text: "Unisex essentials" },
  { icon: "ri-shield-check-line", text: "Secure payments" },
  { icon: "ri-medal-line", text: "Premium quality since 2008" },
  { icon: "ri-price-tag-3-line", text: "5% off your first order" },
];

const Row = ({ hidden = false }: { hidden?: boolean }) => (
  <ul
    className="flex shrink-0 items-center"
    aria-hidden={hidden || undefined}
  >
    {ITEMS.map((item) => (
      <li
        key={item.text}
        className="flex items-center gap-3.5 whitespace-nowrap px-6 max-[900px]:gap-2.5 max-[900px]:px-4"
      >
        <i
          className={`${item.icon} text-xl text-sky-400 max-[900px]:text-lg`}
          aria-hidden="true"
        />
        <span className="text-[15px] font-semibold uppercase tracking-[0.14em] text-(--white) max-[900px]:text-[13px]">
          {item.text}
        </span>
        <span
          className="ml-6 h-1.5 w-1.5 rotate-45 bg-sky-400/80 max-[900px]:ml-4"
          aria-hidden="true"
        />
      </li>
    ))}
  </ul>
);

const Marquee = () => {
  return (
    <section
      className="relative overflow-hidden border-y border-sky-400/30 bg-(--black) py-5 max-[900px]:py-4"
      aria-label="Store highlights"
    >
      <div className="group mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        {/* Two identical rows, shifted by -50% for a seamless loop */}
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
};

export default Marquee;