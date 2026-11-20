import { useCallback, useEffect, useRef } from "react";

const SWIPE_PX = 50;

const Lightbox = ({
  images,
  alt,
  index,
  onClose,
  onIndexChange,
}: {
  images: string[];
  alt: string;
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) => {
  const touchX = useRef<number | null>(null);
  const count = images.length;

  const go = useCallback(
    (dir: 1 | -1) => onIndexChange((index + dir + count) % count),
    [index, count, onIndexChange]
  );

  // Lock page scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Keyboard: Escape closes, arrow keys move
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (count > 1 && e.key === "ArrowRight") go(1);
      else if (count > 1 && e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose, count]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null || count < 2) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < SWIPE_PX) return;
    go(dx < 0 ? 1 : -1); // swipe left = next, swipe right = previous
  };

  return (
    <div
      className="fixed inset-0 z-120 flex items-center justify-center bg-black/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} photos`}
      onClick={onClose}
    >
      {/* Close: plain X, no border, no hover effect */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close photos"
        className="absolute right-4 top-4 z-10 cursor-pointer p-2 text-[32px] leading-none text-(--white)"
      >
        <i className="ri-close-line" aria-hidden="true" />
      </button>

      {/* Counter */}
      {count > 1 && (
        <p
          className="absolute left-4 top-6 z-10 text-[15px] font-medium text-(--white)"
          aria-live="polite"
        >
          {index + 1} / {count}
        </p>
      )}

      {/* Photo (swipe left or right on touch screens) */}
      <div
        className="flex max-h-full w-full max-w-4xl touch-pan-y items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img
          key={index}
          src={images[index]}
          alt={`${alt}, photo ${index + 1}`}
          draggable={false}
          className="max-h-[82svh] w-auto max-w-full select-none rounded-md object-contain"
        />
      </div>

      {/* Dots */}
      {count > 1 && (
        <div
          className="absolute inset-x-0 bottom-5 flex justify-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
              onClick={() => onIndexChange(i)}
              className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                i === index ? "w-7 bg-(--white)" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Lightbox;