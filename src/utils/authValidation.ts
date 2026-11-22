export const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());

export const isPhone = (v: string) => v.replace(/\D/g, "").length >= 7;

// Returns an error message, or "" when the password is fine
export const passwordError = (v: string) => {
  if (v.length < 8) return "Use at least 8 characters.";
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v))
    return "Use a mix of letters and numbers.";
  return "";
};