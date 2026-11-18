import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

const Cart = () => {
  return (
    <>
      <PageHeader
        eyebrow="Your bag"
        outline="your"
        title="cart"
        description="Review the items you have picked before you check out."
        crumb="Cart"
      />

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
    </>
  );
};

export default Cart;