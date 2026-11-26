import { env } from "../config/env.js";

export const COOKIE_NAME = "pz_token";
const base = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    ...base,
    maxAge: env.JWT_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, base);
}