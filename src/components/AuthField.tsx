import { useId, useState } from "react";
import type { InputHTMLAttributes } from "react";

interface AuthFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  error?: string;
  hint?: string;
}

const AuthField = ({
  label,
  error,
  hint,
  type = "text",
  ...rest
}: AuthFieldProps) => {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div>
      <label htmlFor={id} className="text-[14px] font-medium text-(--black)">
        {label}
      </label>

      <div className="relative mt-1.5">
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`h-11 w-full rounded-md border bg-(--white) px-4 text-[15px] text-(--black) outline-none transition-colors placeholder:text-(--grey)/60 focus:border-(--navy) ${
            isPassword ? "pr-12" : ""
          } ${error ? "border-red-700" : "border-(--border)"}`}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center text-[20px] text-(--grey)"
          >
            <i className={show ? "ri-eye-off-line" : "ri-eye-line"} aria-hidden="true" />
          </button>
        )}
      </div>

      {error ? (
        <p id={`${id}-error`} className="mt-1 text-[13px] text-red-700" role="alert">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1 text-[13px] text-(--grey)">
            {hint}
          </p>
        )
      )}
    </div>
  );
};

export default AuthField;