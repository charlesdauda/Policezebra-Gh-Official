import { useEffect, useRef, useState } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const CODE_LENGTH = 6;
const EXPIRY_MS = 2 * 60 * 1000; // a code expires after 2 minutes
const COOLDOWN_MS = 3 * 60 * 1000; // a new code can be requested after 3 minutes
const MAX_RESENDS = 3; // new codes allowed per sign-up

// TODO: remove. This stands in for the backend check so you can test the screens.
// Type 123456 to see the success path; anything else shows the wrong code error.
const DEMO_CODE = "123456";

const fmt = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

// Shows only the last 3 digits, e.g. "••• ••• 789"
const maskPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return digits.length > 3 ? `••• ••• ${digits.slice(-3)}` : phone;
};

const OtpForm = ({
  phone,
  email,
  fullName,
  redirectTo,
}: {
  phone: string;
  email: string;
  fullName: string;
  redirectTo: string;
}) => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [expiresAt, setExpiresAt] = useState(() => Date.now() + EXPIRY_MS);
  const [resendAt, setResendAt] = useState(() => Date.now() + COOLDOWN_MS);
  const [resendsLeft, setResendsLeft] = useState(MAX_RESENDS);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  const timer = useRef<number | undefined>(undefined);

  // Clock tick for the two countdowns
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const expired = now >= expiresAt;
  const cooldownLeft = resendAt - now;
  const canResend = cooldownLeft <= 0 && resendsLeft > 0;

  const focusBox = (i: number) => boxes.current[i]?.focus();

  const clearMessages = () => {
    setError("");
    setInfo("");
  };

  const setDigit = (i: number, value: string) => {
    const d = value.replace(/\D/g, "").slice(-1);
    setDigits((cur) => cur.map((c, idx) => (idx === i ? d : c)));
    clearMessages();
    if (d && i < CODE_LENGTH - 1) focusBox(i + 1);
  };

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      setDigits((cur) => cur.map((c, idx) => (idx === i - 1 ? "" : c)));
      focusBox(i - 1);
    } else if (e.key === "ArrowLeft" && i > 0) focusBox(i - 1);
    else if (e.key === "ArrowRight" && i < CODE_LENGTH - 1) focusBox(i + 1);
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!text) return;
    e.preventDefault();
    setDigits(Array.from({ length: CODE_LENGTH }, (_, i) => text[i] ?? ""));
    clearMessages();
    focusBox(Math.min(text.length, CODE_LENGTH - 1));
  };

  const code = digits.join("");

  const verify = () => {
    if (verifying || verified) return;
    if (expired) {
      setError("This code has expired. Request a new one.");
      return;
    }
    if (code.length < CODE_LENGTH) {
      setError("Enter the 6-digit code.");
      return;
    }

    setVerifying(true);
    // TODO: backend. Send `phone` and `code` to be checked.
    timer.current = window.setTimeout(() => {
      setVerifying(false);
      if (code === DEMO_CODE) {
        setVerified(true);
        // TODO: backend. Sign in with the real account returned after verification.
        signIn({ fullName, email, phone });
        timer.current = window.setTimeout(() => navigate(redirectTo), 1400);
      } else {
        setError("That code is incorrect. Check it and try again.");
        setDigits(Array(CODE_LENGTH).fill(""));
        focusBox(0);
      }
    }, 900);
  };

  const resend = () => {
    if (!canResend) return;
    const t = Date.now();
    // TODO: backend. Generate a fresh code and send it by SMS to `phone`.
    setNow(t);
    setExpiresAt(t + EXPIRY_MS);
    setResendAt(t + COOLDOWN_MS);
    setResendsLeft((n) => n - 1);
    setDigits(Array(CODE_LENGTH).fill(""));
    setError("");
    setInfo(`A new code was sent to ${maskPhone(phone)}.`);
    focusBox(0);
  };

  if (verified) {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-(--navy) text-[32px] text-(--white)">
          <i className="ri-check-line" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-[24px] font-semibold uppercase leading-none text-(--black)">
          Account verified
        </h2>
        <p className="mt-3 text-[15px] text-(--grey)">Taking you to the store...</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-5 flex items-center gap-2 text-[14px] text-(--grey)">
        <i className="ri-smartphone-line text-[18px] text-(--navy)" aria-hidden="true" />
        Code sent to{" "}
        <span className="font-semibold text-(--black)">{maskPhone(phone)}</span>
      </p>

      <div className="flex justify-between gap-2 sm:gap-3">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              boxes.current[i] = el;
            }}
            value={d}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            onPaste={onPaste}
            onFocus={(e) => e.target.select()}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={1}
            autoFocus={i === 0}
            aria-label={`Digit ${i + 1}`}
            aria-invalid={Boolean(error)}
            className={`h-14 w-full min-w-0 rounded-md border bg-(--white) text-center text-[22px] font-semibold text-(--black) outline-none transition-colors focus:border-(--navy) sm:h-16 sm:text-[26px] ${
              error ? "border-red-700" : "border-(--border)"
            }`}
          />
        ))}
      </div>

      <div aria-live="polite" className="mt-3 min-h-5 text-[13px]">
        {error && (
          <p className="text-red-700" role="alert">
            {error}
          </p>
        )}
        {!error && info && <p className="text-(--navy)">{info}</p>}
      </div>

      <p className="mt-2 text-[14px] text-(--grey)">
        {expired ? (
          <span className="font-medium text-red-700">This code has expired.</span>
        ) : (
          <>
            Code expires in{" "}
            <span className="font-semibold text-(--black)">{fmt(expiresAt - now)}</span>
          </>
        )}
      </p>

      <button
        type="button"
        onClick={verify}
        disabled={verifying || expired}
        className="mt-6 flex h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-md bg-(--navy) px-4 text-[15px] font-semibold uppercase tracking-[0.06em] text-(--white) transition-colors hover:bg-[#061a33] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {verifying ? (
          <>
            <i className="ri-loader-4-line animate-spin text-xl" aria-hidden="true" />
            Verifying...
          </>
        ) : (
          "Verify"
        )}
      </button>

      <div className="mt-6 text-center text-[15px] text-(--grey)">
        {resendsLeft === 0 && cooldownLeft <= 0 ? (
          <p>
            You have used all your new code requests.{" "}
            <Link
              to="/contact"
              className="font-semibold text-(--navy) underline underline-offset-4"
            >
              Contact us
            </Link>{" "}
            for help.
          </p>
        ) : (
          <>
            <p>Didn't get the code?</p>
            {canResend ? (
              <button
                type="button"
                onClick={resend}
                className="mt-1 cursor-pointer font-semibold text-(--navy) underline underline-offset-4"
              >
                Send a new code
              </button>
            ) : (
              <p className="mt-1 font-medium text-(--black)">
                Send a new code in {fmt(cooldownLeft)}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Needs the phone number from the register step; without it, go back to register
const OtpVerify = () => {
  const location = useLocation();
  const state = location.state as {
    phone?: string;
    email?: string;
    fullName?: string;
    from?: string;
  } | null;

  if (!state?.phone) return <Navigate to="/account" replace />;
  return (
    <OtpForm
      phone={state.phone}
      email={state.email ?? ""}
      fullName={state.fullName ?? ""}
      redirectTo={state.from ?? "/"}
    />
  );
};

export default OtpVerify;