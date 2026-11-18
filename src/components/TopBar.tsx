import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Message {
  icon: string;
  text: string;
  cta: string;
  to: string;
}

const MESSAGES: Message[] = [
  {
    icon: "ri-truck-line",
    text: "Fast returns. Not the perfect fit? Send it back within 14 days.",
    cta: "Learn more",
    to: "/about",
  },
  {
    icon: "ri-price-tag-3-line",
    text: "Get 5% off your first order.",
    cta: "Shop now",
    to: "/shop",
  },
];

const INTERVAL = 4000;
const TRANSITION = 650;

const TopBar = () => {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  // slide up every 4 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setAnimate(true);
      setIndex((i) => i + 1);
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  // after reaching the cloned first item, silently jump back to the real first
  useEffect(() => {
    if (index === MESSAGES.length) {
      const t = setTimeout(() => {
        setAnimate(false);
        setIndex(0);
      }, TRANSITION);
      return () => clearTimeout(t);
    }
  }, [index]);

  const items = [...MESSAGES, MESSAGES[0]];

  return (
    <div
      className="relative bg-(--black) text-sm text-(--white) max-[900px]:text-[13px]"
      role="region"
      aria-label="Store announcements"
    >
      <div className="w-full max-w-350uto px-6 max-[900px]:px-4 h-10 max-[900px]:h-9.5 overflow-hidden">
        <div
          className="will-change-transform"
          aria-live="polite"
          style={{
            // percentage of the track's own height, so it works at any bar height
            transform: `translateY(-${(index * 100) / items.length}%)`,
            transition: animate
              ? `transform ${TRANSITION}ms cubic-bezier(0.65, 0, 0.35, 1)`
              : "none",
          }}
        >
          {items.map((m, i) => (
            <p
              key={i}
              className="h-10 max-[900px]:h-9.5 flex items-center gap-2.5 whitespace-nowrap font-medium"
            >
              <i className={`${m.icon} text-sky-400 text-lg`} aria-hidden="true" />
              <span className="overflow-hidden text-ellipsis">{m.text}</span>
              <Link
                to={m.to}
                className="inline-flex items-center gap-1 font-bold uppercase text-[12.5px] tracking-[0.08em] leading-[1.2] shrink-0 hover:text-sky-400 max-[900px]:hidden"
              >
                {m.cta}
                <i className="ri-arrow-right-line" aria-hidden="true" />
              </Link>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopBar;