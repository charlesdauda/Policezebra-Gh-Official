import { jwtVerify } from "jose";
import { env } from "../config/env.js";

const secret = new TextEncoder().encode(env.ADMIN_JWT_SECRET);

export async function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.pz_admin;
    if (!token) return res.status(401).json({ error: "Administrator authentication required." });
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    if (payload.role !== "admin" || !payload.sub) return res.status(403).json({ error: "Administrator access required." });
    req.admin = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired administrator session." });
  }
}
