import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthField from "./AuthField";
import { isEmail, isPhone } from "../utils/authValidation";
import { useAuth } from "../context/useAuth";

const primaryBtn =
  "flex h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-md bg-(--navy) px-4 text-[15px] font-semibold uppercase tracking-[0.06em] text-(--white) transition-colors hover:bg-[#061a33] disabled:cursor-wait disabled:opacity-70";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const from = (location.state as { from?: string } | null)?.from ?? "/";
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const id = identifier.trim();
    const found: typeof errors = {};
    if (!id) found.identifier = "Enter your email or phone number.";
    else if (!isEmail(id) && !isPhone(id))
      found.identifier = "Enter a valid email or phone number.";
    if (!password) found.password = "Enter your password.";

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);

    // TODO: backend. Sign the user in with `id` (email or phone) and `password`.
    // Show a "wrong details" error here if the backend rejects them.
    timer.current = window.setTimeout(() => {
      setSubmitting(false);
      // TODO: backend. Sign in with the full account returned by your server.
      signIn({
        fullName: "",
        email: isEmail(id) ? id : "",
        phone: isEmail(id) ? "" : id,
      });
      navigate(from);
    }, 1000);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <AuthField
        label="Email or phone number"
        autoComplete="username"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        error={errors.identifier}
      />

      <div>
        <AuthField
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <div className="mt-2 text-right">
          <Link
            to="/account/forgot-password"
            className="text-[14px] font-semibold text-(--navy) underline underline-offset-4"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <button type="submit" disabled={submitting} className={primaryBtn}>
        {submitting ? (
          <>
            <i className="ri-loader-4-line animate-spin text-xl" aria-hidden="true" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </button>

      <p className="text-center text-[15px] text-(--grey)">
        New to Police Zebra?{" "}
        <Link
          to="/account"
          state={location.state}
          className="font-semibold text-(--navy) underline underline-offset-4"
        >
        Create an account
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;