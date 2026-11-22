import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import AuthField from "./AuthField";
import { isEmail } from "../utils/authValidation";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!isEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setSubmitting(true);

    // TODO: backend. Email a reset link to this address. The link should point to
    // /account/reset-password?token=... (the token is read on that page later).
    const address = email.trim();
    timer.current = window.setTimeout(() => {
      setSubmitting(false);
      setSentTo(address);
    }, 1000);
  };

  if (sentTo) {
    return (
      <div className="text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-(--ivory) text-[30px] text-(--navy) ring-1 ring-(--border)">
          <i className="ri-mail-send-line" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-[22px] font-semibold uppercase leading-none text-(--black)">
          Check your email
        </h2>
        <p className="mt-3 text-[15px] leading-normal text-(--grey)">
          If an account exists for{" "}
          <span className="font-medium text-(--black)">{sentTo}</span>, we have sent
          a link to reset your password.
        </p>

        <Link
          to="/account/login"
          className="mt-6 flex h-13 w-full items-center justify-center rounded-md bg-(--navy) text-[15px] font-semibold uppercase tracking-[0.06em] text-(--white) transition-colors hover:bg-[#061a33]"
        >
          Back to sign in
        </Link>
        <button
          type="button"
          onClick={() => {
            setSentTo("");
            setEmail("");
          }}
          className="mt-4 cursor-pointer text-[14px] font-semibold text-(--navy) underline underline-offset-4"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <AuthField
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
      />

      <button
        type="submit"
        disabled={submitting}
        className="flex h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-md bg-(--navy) px-4 text-[15px] font-semibold uppercase tracking-[0.06em] text-(--white) transition-colors hover:bg-[#061a33] disabled:cursor-wait disabled:opacity-70"
      >
        {submitting ? (
          <>
            <i className="ri-loader-4-line animate-spin text-xl" aria-hidden="true" />
            Sending...
          </>
        ) : (
          "Send reset link"
        )}
      </button>

      <p className="text-center text-[15px] text-(--grey)">
        Remembered it?{" "}
        <Link to="/account/login" className="font-semibold text-(--navy) underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;