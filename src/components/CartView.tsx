import { Link } from "react-router-dom";
import { MAX_QTY, variantText } from "../context/cartContext";
import { useCart } from "../context/useCart";
import { eurFmt, ghsFmt } from "../data/products";

const CartView = () => {
  const { lines, subtotalGhs, subtotalEur, setQty, removeItem, notify } = useCart();

  if (lines.length === 0) {
    return (
      <section className="flex min-h-[50svh] items-center justify-center px-5 py-16 sm:py-20">
        <div className="flex max-w-md flex-col items-center text-center">
          <span className="flex size-20 items-center justify-center rounded-full bg-(--white) text-[36px] text-(--navy) ring-1 ring-(--border)">
            <i className="ri-shopping-bag-3-line" aria-hidden="true" />
          </span>

          <h2 className="mt-6 text-[26px] font-semibold uppercase leading-none tracking-[0.01em] text-(--black) sm:text-[32px]">
            Your cart is empty
          </h2>
          <p className="mt-3 text-base leading-normal text-(--grey)">
            Looks like you haven't added anything yet. Explore the collection and
            find something you love.
          </p>

          <Link
            to="/shop"
            className="group mt-8 inline-flex h-13 items-center justify-center gap-2.5 rounded-md bg-(--navy) px-8 text-[15px] font-semibold uppercase tracking-[0.06em] text-(--white) transition-colors duration-200 hover:bg-[#061a33]"
          >
            Continue shopping
            <i className="ri-arrow-right-line transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-16 pt-10 sm:pb-20 sm:pt-14">
      <div className="mx-auto grid w-full max-w-350 gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:gap-12">
        {/* Items */}
        <ul className="border-t border-(--border)">
          {lines.map((l) => (
            <li
              key={l.key}
              className="flex gap-4 border-b border-(--border) py-5 sm:gap-6 sm:py-6"
            >
              <img
                src={l.product.image}
                alt={l.product.name}
                className="size-24 shrink-0 rounded-md border border-(--border) object-cover sm:size-28"
              />

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-(--grey)">
                      {l.product.category}
                    </p>
                    <h3 className="mt-1 text-[16px] font-semibold leading-tight text-(--black) sm:text-[18px]">
                      {l.product.name}
                    </h3>
                    <p className="mt-1.5 text-[13px] text-(--grey) sm:text-[14px]">
                      {variantText(l)}
                    </p>
                  </div>
                  <p className="shrink-0 text-[16px] font-semibold text-(--black) sm:text-[18px]">
                    {ghsFmt(l.product.ghs * l.qty)}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                  <div className="inline-flex h-10 items-center rounded-md border border-(--border) bg-(--white)">
                    <button
                      type="button"
                      onClick={() => setQty(l.key, l.qty - 1)}
                      disabled={l.qty <= 1}
                      aria-label="Decrease quantity"
                      className="flex size-10 cursor-pointer items-center justify-center text-[18px] text-(--black) transition-colors hover:text-(--navy) disabled:cursor-not-allowed disabled:text-(--grey)/40"
                    >
                      <i className="ri-subtract-line" />
                    </button>
                    <span className="w-8 text-center text-[15px] font-medium" aria-live="polite">
                      {l.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(l.key, l.qty + 1)}
                      disabled={l.qty >= MAX_QTY}
                      aria-label="Increase quantity"
                      className="flex size-10 cursor-pointer items-center justify-center text-[18px] text-(--black) transition-colors hover:text-(--navy) disabled:cursor-not-allowed disabled:text-(--grey)/40"
                    >
                      <i className="ri-add-line" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      removeItem(l.key);
                      notify("Removed from cart");
                    }}
                    className="cursor-pointer text-[13px] font-semibold uppercase tracking-[0.06em] text-(--grey) underline underline-offset-4 transition-colors hover:text-(--navy)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="h-fit rounded-xl border border-(--border) bg-(--white) p-5 sm:p-6 lg:sticky lg:top-40">
          <h2 className="text-[20px] font-semibold uppercase tracking-[0.01em] text-(--black)">
            Order summary
          </h2>

          <div className="mt-5 flex items-baseline justify-between border-t border-(--border) pt-5">
            <span className="text-[15px] text-(--grey)">Subtotal</span>
            <span className="text-[18px] font-semibold text-(--black)">
              {ghsFmt(subtotalGhs)}
            </span>
          </div>
          <p className="mt-1 text-right text-[13px] text-(--grey)">
            {eurFmt(subtotalEur)}
          </p>

          <Link
            to="/checkout"
            className="mt-6 inline-flex h-13 w-full items-center justify-center rounded-md bg-(--navy) text-[15px] font-semibold uppercase tracking-[0.06em] text-(--white) transition-colors hover:bg-[#061a33]"
          >
            Checkout
          </Link>
          <Link
            to="/shop"
            className="mt-3 inline-flex h-13 w-full items-center justify-center rounded-md border-[1.5px] border-(--navy) text-[15px] font-semibold uppercase tracking-[0.06em] text-(--navy) transition-colors hover:bg-(--navy) hover:text-(--white)"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </section>
  );
};

export default CartView;