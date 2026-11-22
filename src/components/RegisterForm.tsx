import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthField from "./AuthField";
import { isEmail, isPhone, passwordError } from "../utils/authValidation";

type Errors = Partial<Record<"fullName" | "email" | "phone" | "password", string>>;

const RegisterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const set =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const found: Errors = {};
    if (form.fullName.trim().length < 2) found.fullName = "Enter your full name.";
    if (!isEmail(form.email)) found.email = "Enter a valid email address.";
    if (!isPhone(form.phone)) found.phone = "Enter a valid phone number.";
    const pw = passwordError(form.password);
    if (pw) found.password = pw;

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    const phone = form.phone.trim();

    // TODO: backend. Create the account, then send the 6-digit code by SMS to `phone`.
    timer.current = window.setTimeout(() => {
      setSubmitting(false);
      navigate("/account/verify", {
        state: {
          phone,
          email: form.email.trim(),
          fullName: form.fullName.trim(),
          from,
        },
      });
    }, 1000);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <AuthField
        label="Full name"
        autoComplete="name"
        value={form.fullName}
        onChange={set("fullName")}
        error={errors.fullName}
      />
      <AuthField
        label="Email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={set("email")}
        error={errors.email}
      />
      <AuthField
        label="Phone number"
        type="tel"
        autoComplete="tel"
        value={form.phone}
        onChange={set("phone")}
        error={errors.phone}
      />
      <AuthField
        label="Password"
        type="password"
        autoComplete="new-password"
        value={form.password}
        onChange={set("password")}
        error={errors.password}
        hint="At least 8 characters, with letters and numbers."
      />

      <button
        type="submit"
        disabled={submitting}
        className="flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-md bg-(--navy) px-4 text-[15px] font-semibold uppercase tracking-[0.06em] text-(--white) transition-colors hover:bg-[#061a33] disabled:cursor-wait disabled:opacity-70"
      >
        {submitting ? (
          <>
            <i className="ri-loader-4-line animate-spin text-xl" aria-hidden="true" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </button>

      <p className="text-center text-[15px] text-(--grey)">
        Already have an account?{" "}
        <Link
          to="/account/login"
          state={location.state}
          className="font-semibold text-(--navy) underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;