import { useEffect } from "react";
import { Link } from "react-router-dom";
import { variantText, type CartLine } from "../context/cartContext";
import { ghsFmt } from "../data/products";

const AddedToCartModal = ({
  line,
  onClose,
}: {
  line: CartLine;
  onClose: () => void;
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-110 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[3px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Added to cart"
    >
      <div
        className="w-full max-w-md rounded-xl bg-(--white) p-5 shadow-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md bg-(--navy) text-(--white)">
              <i className="ri-check-line text-xl" aria-hidden="true" />
            </span>
            <h2 className="text-[20px] font-semibold uppercase tracking-[0.01em] text-(--black) sm:text-[22px]">
              Added to cart
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full text-[22px] text-(--black) transition-colors hover:bg-black/10"
          >
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-4 rounded-lg border border-(--border) p-3">
          <img
            src={line.product.image}
            alt={line.product.name}
            className="size-20 shrink-0 rounded-md object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[16px] font-semibold text-(--black)">
              {line.product.name}
            </p>
            <p className="mt-1 text-[13px] leading-snug text-(--grey)">
              {variantText(line)} · Qty {line.qty}
            </p>
          </div>
          <p className="shrink-0 text-[16px] font-semibold text-(--black)">
            {ghsFmt(line.product.ghs * line.qty)}
          </p>
        </div>

        <div className="mt-5 grid gap-3">
          <Link
            to="/checkout"
            onClick={onClose}
            className="inline-flex h-13 items-center justify-center rounded-md bg-(--navy) text-[15px] font-semibold uppercase tracking-[0.06em] text-(--white) transition-colors hover:bg-[#061a33]"
          >
            Checkout
          </Link>
          <Link
            to="/shop"
            onClick={onClose}
            className="inline-flex h-13 items-center justify-center rounded-md border-[1.5px] border-(--navy) text-[15px] font-semibold uppercase tracking-[0.06em] text-(--navy) transition-colors hover:bg-(--navy) hover:text-(--white)"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddedToCartModal;