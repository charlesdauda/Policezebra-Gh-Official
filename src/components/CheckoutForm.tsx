import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { variantText } from "../context/cartContext";
import { useCart } from "../context/useCart";
import { eurFmt, ghsFmt } from "../data/products";
import OrderSuccessModal from "./OrderSuccessModal";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  mapsLink: string;
}

type Errors = Partial<
  Record<"fullName" | "email" | "phone" | "address" | "agree", string>
>;

const inputClass =
  "mt-2 w-full rounded-md border border-(--border) bg-(--white) px-4 text-[15px] text-(--black) outline-none transition-colors placeholder:text-(--grey)/60 focus:border-(--navy)";

const Field = ({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) => (
  <div>
    <label htmlFor={id} className="text-[14px] font-medium text-(--black)">
      {label}
      {optional && <span className="font-normal text-(--grey)"> (optional)</span>}
    </label>
    {children}
    {error && (
      <p className="mt-1.5 text-[13px] text-red-700" role="alert">
        {error}
      </p>
    )}
  </div>
);

const CheckoutForm = () => {
  const { lines, subtotalGhs, subtotalEur, removeItem, clear } = useCart();

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    mapsLink: "",
  });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{
    orderNo: string;
    total: number;
    name: string;
    email: string;
  } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const set =
    (key: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = (): Errors => {
    const e: Errors = {};
    if (form.fullName.trim().length < 2) e.fullName = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      e.email = "Please enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 7)
      e.phone = "Please enter a valid phone number.";
    if (form.address.trim().length < 5)
      e.address = "Please enter your delivery address.";
    if (!agree) e.agree = "Please agree to the terms to continue.";
    return e;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const total = subtotalGhs;
    const name = form.fullName.trim();
    const email = form.email.trim();

    setSubmitting(true);

    // TODO: backend. Create the order for this signed-in user and start the
    // Paystack payment here. Show the success popup only after payment is confirmed.
    timer.current = window.setTimeout(() => {
      setSuccess({
        orderNo: `PZ-${Date.now().toString().slice(-6)}`,
        total,
        name,
        email,
      });
      clear();
      setSubmitting(false);
    }, 1400);
  };

  if (success) {
    return (
      <section className="min-h-[60svh]">
        <OrderSuccessModal {...success} />
      </section>
    );
  }

  if (lines.length === 0) {
    return (
      <section className="flex min-h-[50svh] items-center justify-center px-5 py-16 sm:py-20">
        <div className="flex max-w-md flex-col items-center text-center">
          <span className="flex size-20 items-center justify-center rounded-full bg-(--white) text-[36px] text-(--navy) ring-1 ring-(--border)">
            <i className="ri-shopping-bag-3-line" aria-hidden="true" />
          </span>
          <h2 className="mt-6 text-[26px] font-semibold uppercase leading-none tracking-[0.01em] text-(--black) sm:text-[32px]">
            Nothing to check out
          </h2>
          <p className="mt-3 text-base leading-normal text-(--grey)">
            Your cart is empty. Add something first and come back.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex h-13 items-center justify-center rounded-md bg-(--navy) px-8 text-[15px] font-semibold uppercase tracking-[0.06em] text-(--white) transition-colors hover:bg-[#061a33]"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-16 pt-10 sm:pb-20 sm:pt-14">
      <div className="mx-auto grid w-full max-w-350 gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        {/* Left: shipping */}
        <form
          onSubmit={onSubmit}
          noValidate
          className="h-fit rounded-xl border border-(--border) bg-(--white) p-5 sm:p-6"
        >
          <h2 className="text-[20px] font-semibold uppercase tracking-[0.01em] text-(--black)">
            Shipping details
          </h2>

          <p className="mt-4 rounded-md bg-(--ivory) px-4 py-3 text-[14px] leading-normal text-(--grey)">
            Orders are delivered by Uber. A clear address, and a Google Maps link
            if you have one, helps your courier find you fast.
          </p>

          <div className="mt-6 space-y-5">
            <Field id="fullName" label="Full name" error={errors.fullName}>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                value={form.fullName}
                onChange={set("fullName")}
                className={`${inputClass} h-12`}
              />
            </Field>

            <Field id="email" label="Email" error={errors.email}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={set("email")}
                className={`${inputClass} h-12`}
              />
            </Field>

            <Field id="phone" label="Phone" error={errors.phone}>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={set("phone")}
                className={`${inputClass} h-12`}
              />
            </Field>

            <Field id="address" label="Delivery address" error={errors.address}>
              <textarea
                id="address"
                rows={4}
                autoComplete="street-address"
                value={form.address}
                onChange={set("address")}
                className={`${inputClass} resize-y py-3`}
              />
            </Field>

            <Field id="mapsLink" label="Google Maps link" optional>
              <input
                id="mapsLink"
                type="url"
                value={form.mapsLink}
                onChange={set("mapsLink")}
                placeholder="Paste a Google Maps pin link"
                className={`${inputClass} h-12`}
              />
            </Field>
          </div>

          <div className="mt-6">
            <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-normal text-(--grey)">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 size-5 shrink-0 cursor-pointer accent-(--navy)"
              />
              <span>
                I agree to the{" "}
                <span className="font-semibold text-(--navy)">terms of service</span>{" "}
                and{" "}
                <span className="font-semibold text-(--navy)">privacy policy</span>,
                and consent to my order details being processed to fulfil this
                purchase.
              </span>
            </label>
            {errors.agree && (
              <p className="mt-1.5 text-[13px] text-red-700" role="alert">
                {errors.agree}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex h-14 w-full cursor-pointer items-center justify-center gap-2.5 rounded-md bg-(--navy) px-4 text-[14px] font-semibold uppercase tracking-wider text-(--white) transition-colors hover:bg-[#061a33] disabled:cursor-wait disabled:opacity-70 sm:text-[15px]"
          >
            {submitting ? (
              <>
                <i className="ri-loader-4-line animate-spin text-xl" aria-hidden="true" />
                Processing...
              </>
            ) : (
              <>Pay {ghsFmt(subtotalGhs)} with Paystack</>
            )}
          </button>
        </form>

        {/* Right: order summary (first on mobile) */}
        <aside className="order-first h-fit rounded-xl border border-(--border) bg-(--white) p-5 sm:p-6 lg:sticky lg:top-40 lg:order-last">
          <h2 className="text-[20px] font-semibold uppercase tracking-[0.01em] text-(--black)">
            Order summary
          </h2>

          <ul className="mt-5 divide-y divide-(--border) border-t border-(--border)">
            {lines.map((l) => (
              <li key={l.key} className="flex items-start gap-3 py-4">
                <img
                  src={l.product.image}
                  alt=""
                  className="size-14 shrink-0 rounded-md border border-(--border) object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium leading-snug text-(--black)">
                    {l.product.name}
                  </p>
                  <p className="mt-0.5 text-[13px] text-(--grey)">
                    {variantText(l)} × {l.qty}
                  </p>
                </div>
                <p className="shrink-0 text-[15px] font-semibold text-(--black)">
                  {ghsFmt(l.product.ghs * l.qty)}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(l.key)}
                  aria-label={`Remove ${l.product.name}`}
                  className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-[18px] text-(--grey) transition-colors hover:bg-black/10 hover:text-(--black)"
                >
                  <i className="ri-close-line" />
                </button>
              </li>
            ))}
          </ul>

          <div className="space-y-3 border-t border-(--border) pt-5">
            <div className="flex items-baseline justify-between text-[15px] text-(--grey)">
              <span>Subtotal</span>
              <span>{ghsFmt(subtotalGhs)}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[18px] font-semibold text-(--black)">Total</span>
              <span className="text-[22px] font-semibold text-(--navy)">
                {ghsFmt(subtotalGhs)}
              </span>
            </div>
            <p className="text-right text-[13px] text-(--grey)">
              {eurFmt(subtotalEur)}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default CheckoutForm;