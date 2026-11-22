import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import AuthField from "./AuthField";
import { passwordError } from "../utils/authValidation";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const found: typeof errors = {};
    const pw = passwordError(password);
    if (pw) found.password = pw;
    if (confirm !== password) found.confirm = "The passwords don't match.";

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);

    // TODO: backend. Read the token from the URL (?token=...) and save the new
    // password. Show an "invalid or expired link" message if the token fails.
    timer.current = window.setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 1000);
  };

  if (done) {
    return (
      <div className="text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-(--navy) text-[32px] text-(--white)">
          <i className="ri-check-line" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-[22px] font-semibold uppercase leading-none text-(--black)">
          Password updated
        </h2>
        <p className="mt-3 text-[15px] leading-normal text-(--grey)">
          You can now sign in with your new password.
        </p>
        <Link to="/account/login" className="mt-6 flex h-13 ...">Sign in</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <AuthField
        label="New password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        hint="At least 8 characters, with letters and numbers."
      />
      <AuthField
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm}
      />

      <button
        type="submit"
        disabled={submitting}
        className="flex h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-md bg-(--navy) px-4 text-[15px] font-semibold uppercase tracking-[0.06em] text-(--white) transition-colors hover:bg-[#061a33] disabled:cursor-wait disabled:opacity-70"
      >
        {submitting ? (
          <>
            <i className="ri-loader-4-line animate-spin text-xl" aria-hidden="true" />
            Saving...
          </>
        ) : (
          "Update password"
        )}
      </button>
    </form>
  );
};

export default ResetPasswordForm;