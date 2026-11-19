import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ghsFmt } from "../data/products";

const OrderSuccessModal = ({
  orderNo,
  total,
  name,
  email,
}: {
  orderNo: string;
  total: number;
  name: string;
  email: string;
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const firstName = name.split(" ")[0];

  return (
    <div
      className="fixed inset-0 z-110 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[3px]"
      role="dialog"
      aria-modal="true"
      aria-label="Order placed"
    >
      <div className="w-full max-w-md rounded-xl bg-(--white) p-6 text-center shadow-2xl sm:p-8">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-(--navy) text-[32px] text-(--white)">
          <i className="ri-check-line" aria-hidden="true" />
        </span>

        <h2 className="mt-5 text-[26px] font-semibold uppercase leading-none tracking-[0.01em] text-(--black) sm:text-[30px]">
          Order placed
        </h2>
        <p className="mt-3 text-[15px] leading-normal text-(--grey)">
          Thank you, {firstName}. We have received your order and will send a
          confirmation to <span className="font-medium text-(--black)">{email}</span>.
        </p>

        <dl className="mt-6 divide-y divide-(--border) rounded-lg border border-(--border) text-left text-[15px]">
          <div className="flex items-center justify-between px-4 py-3">
            <dt className="text-(--grey)">Order number</dt>
            <dd className="font-semibold text-(--black)">{orderNo}</dd>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <dt className="text-(--grey)">Total paid</dt>
            <dd className="font-semibold text-(--navy)">{ghsFmt(total)}</dd>
          </div>
        </dl>

        <Link
          to="/shop"
          className="mt-6 inline-flex h-13 w-full items-center justify-center rounded-md bg-(--navy) text-[15px] font-semibold uppercase tracking-[0.06em] text-(--white) transition-colors hover:bg-[#061a33]"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessModal;