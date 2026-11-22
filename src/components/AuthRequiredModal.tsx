import { useEffect } from "react";
import { Link } from "react-router-dom";

// Blocks checkout until the customer has an account.
// Both buttons remember to bring them back to checkout afterwards.
const AuthRequiredModal = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const back = { from: "/checkout" };

  return (
    <div
      className="fixed inset-0 z-110 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[3px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-required-title"
    >
      <div className="w-full max-w-md rounded-xl bg-(--white) p-6 text-center shadow-2xl sm:p-8">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-(--ivory) text-[30px] text-(--navy) ring-1 ring-(--border)">
          <i className="ri-lock-line" aria-hidden="true" />
        </span>

        <h2
          id="auth-required-title"
          className="mt-5 text-[22px] font-semibold uppercase leading-tight text-(--black) sm:text-[26px]"
        >
          Log in or register to check out
        </h2>
        <p className="mt-3 text-[15px] leading-normal text-(--grey)">
          You need an account before you can place an order. Your cart is saved
          and will be waiting for you.
        </p>

        <div className="mt-6 grid gap-3">
          <Link
            to="/account"
            state={back}
            className="inline-flex h-13 items-center justify-center rounded-md bg-(--navy) text-[15px] font-semibold uppercase tracking-[0.06em] text-(--white) transition-colors hover:bg-[#061a33]"
          >
            Create account
          </Link>
          <Link
            to="/account/login"
            state={back}
            className="inline-flex h-13 items-center justify-center rounded-md border-[1.5px] border-(--navy) text-[15px] font-semibold uppercase tracking-[0.06em] text-(--navy) transition-colors hover:bg-(--navy) hover:text-(--white)"
          >
            Log in
          </Link>
        </div>

        <Link
          to="/cart"
          className="mt-5 inline-block text-[14px] font-semibold text-(--grey) underline underline-offset-4"
        >
          Back to cart
        </Link>
      </div>
    </div>
  );
};

export default AuthRequiredModal;