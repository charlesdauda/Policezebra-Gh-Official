import { clearAuthCookie } from "../utils/authCookie.js";
import { publicUser } from "../utils/user.js";

export function me(req, res) {
  res.json({ user: publicUser(req.user) });
}

export function logout(_req, res) {
  clearAuthCookie(res);
  res.json({ message: "Signed out." });
}